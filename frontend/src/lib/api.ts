import { MOCK_CATEGORIES, MOCK_MASSEUSES } from "./mock-data";
import { clearAdminSession } from "./admin-auth";
import type {
  Appointment,
  AppointmentConfirmationResult,
  AppointmentCreatePayload,
  AvailabilitySlot,
  Masseuse,
  MasseuseAdmin,
  MasseuseSchedule,
  Service,
  ServiceCategory,
} from "./types";

/** Same-origin API (Next.js route handlers under /api) unless pointed elsewhere explicitly. */
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

/**
 * Public catalog (services, masseuses) is cached and regenerated at most once a
 * minute, so public pages are served pre-rendered instead of hitting the API
 * on every visit. Admin edits show up on the site within this window.
 */
const CATALOG_REVALIDATE_SECONDS = 60;

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    // Live by default (availability, bookings, admin). Public catalog reads opt
    // into ISR by passing `next: { revalidate }` instead.
    ...(options.next ? {} : { cache: "no-store" as const }),
  });

  if (!res.ok) {
    if (res.status === 401 && token) expireAdminSession();
    const body = await res.text().catch(() => "");
    throw new ApiError(body || `Error ${res.status}`, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

/** An expired or revoked admin token: drop it and go back to the login instead of failing every call. */
function expireAdminSession() {
  if (typeof window === "undefined") return;
  clearAdminSession();
  // Outside React (no router here), and a full load also drops any stale admin state.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  if (!window.location.pathname.startsWith("/admin/login")) window.location.assign("/admin/login");
}

/** True when the API isn't reachable or has no database yet — the UI falls back to demo data instead of a blank page. */
function isConnectionFailure(err: unknown) {
  return !(err instanceof ApiError) || err.status === 503;
}

// ---------- Public catalog ----------

export async function getServiceCategories(): Promise<{ data: ServiceCategory[]; isDemo: boolean }> {
  try {
    const data = await request<ServiceCategory[]>("/service-categories", {
      next: { revalidate: CATALOG_REVALIDATE_SECONDS },
    });
    return { data, isDemo: false };
  } catch (err) {
    if (!isConnectionFailure(err)) throw err;
    console.warn("[api] No se pudo conectar con el backend, usando catálogo de demostración.");
    return { data: MOCK_CATEGORIES, isDemo: true };
  }
}

export async function getMasseuses(): Promise<{ data: Masseuse[]; isDemo: boolean }> {
  try {
    const data = await request<Masseuse[]>("/masseuses", { next: { revalidate: CATALOG_REVALIDATE_SECONDS } });
    return { data, isDemo: false };
  } catch (err) {
    if (!isConnectionFailure(err)) throw err;
    console.warn("[api] No se pudo conectar con el backend, usando masajistas de demostración.");
    return { data: MOCK_MASSEUSES, isDemo: true };
  }
}

export async function getAvailability(
  masseuseId: string,
  date: string,
  durationMinutes: number,
): Promise<{ data: AvailabilitySlot[]; isDemo: boolean }> {
  try {
    const data = await request<AvailabilitySlot[]>(
      `/availability?masseuseId=${masseuseId}&date=${date}&durationMinutes=${durationMinutes}`,
    );
    return { data, isDemo: false };
  } catch (err) {
    if (!isConnectionFailure(err)) throw err;
    console.warn("[api] No se pudo conectar con el backend, generando horarios de demostración.");
    return { data: buildMockSlots(date, durationMinutes), isDemo: true };
  }
}

function buildMockSlots(date: string, durationMinutes: number): AvailabilitySlot[] {
  const slots: AvailabilitySlot[] = [];
  const day = new Date(`${date}T00:00:00`);
  const now = new Date();

  for (let hour = 9; hour < 21; hour += 0.5) {
    const start = new Date(day);
    start.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
    const end = new Date(start.getTime() + durationMinutes * 60000);
    if (end.getHours() >= 21 && end.getMinutes() > 0) continue;
    // Deterministic pseudo-availability so the demo looks realistic without a backend.
    const blocked = (start.getHours() * 2 + start.getMinutes() / 30) % 5 === 0;
    slots.push({
      start: start.toISOString(),
      end: end.toISOString(),
      available: !blocked && start > now,
    });
  }
  return slots;
}

export async function createAppointment(payload: AppointmentCreatePayload): Promise<Appointment> {
  return request<Appointment>("/appointments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ---------- Admin ----------

export async function adminLogin(username: string, password: string) {
  return request<{ token: string; expiresAt: string; fullName: string; username: string }>(
    "/auth/login",
    { method: "POST", body: JSON.stringify({ username, password }) },
  );
}

export async function adminGetAppointments(token: string) {
  return request<Appointment[]>("/appointments", {}, token);
}

export async function adminUpdateAppointmentStatus(id: string, status: string, token: string) {
  return request<AppointmentConfirmationResult>(
    `/appointments/${id}/status`,
    { method: "PUT", body: JSON.stringify({ status }) },
    token,
  );
}

export async function adminGetMasseuses(token: string) {
  return request<MasseuseAdmin[]>("/admin/masseuses", {}, token);
}

export async function adminUpsertMasseuse(
  payload: Omit<MasseuseAdmin, "id" | "serviceIds" | "offersHomeVisits">,
  token: string,
  id?: string,
) {
  return request<MasseuseAdmin>(
    id ? `/admin/masseuses/${encodeURIComponent(id)}` : "/admin/masseuses",
    { method: id ? "PUT" : "POST", body: JSON.stringify(payload) },
    token,
  );
}

export async function adminDeleteMasseuse(id: string, token: string) {
  return request<void>(`/admin/masseuses/${encodeURIComponent(id)}`, { method: "DELETE" }, token);
}

export async function adminGetSchedule(id: string, token: string) {
  return request<MasseuseSchedule>(`/admin/masseuses/${id}/schedule`, {}, token);
}

export async function adminSaveSchedule(id: string, schedule: MasseuseSchedule, token: string) {
  return request<MasseuseSchedule>(
    `/admin/masseuses/${id}/schedule`,
    { method: "PUT", body: JSON.stringify(schedule) },
    token,
  );
}

export async function adminGetServices(token: string) {
  return request<Service[]>("/admin/services", {}, token);
}

export async function adminUpsertService(payload: Omit<Service, "id" | "highlights"> & { highlights: string[] }, token: string, id?: string) {
  return request<Service>(
    id ? `/admin/services/${encodeURIComponent(id)}` : "/admin/services",
    { method: id ? "PUT" : "POST", body: JSON.stringify(payload) },
    token,
  );
}

export async function adminDeleteService(id: string, token: string) {
  return request<void>(`/admin/services/${encodeURIComponent(id)}`, { method: "DELETE" }, token);
}

// ---------- Uploads ----------

/**
 * Uploads photos to Firebase Storage through the API, several in parallel, one
 * per request (they're already shrunk on the device). Each file succeeds or
 * fails on its own.
 */
export async function adminUploadImages(files: File[], token: string): Promise<{ urls: string[]; errors: string[] }> {
  const results = await Promise.allSettled(
    files.map(async (file) => {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${API_URL}/admin/uploads`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      if (!res.ok) {
        if (res.status === 401) expireAdminSession();
        throw new ApiError((await res.text().catch(() => "")) || `Error ${res.status}`, res.status);
      }
      return ((await res.json()) as { url: string }).url;
    }),
  );

  const urls: string[] = [];
  const errors: string[] = [];
  results.forEach((r, i) => {
    if (r.status === "fulfilled") urls.push(r.value);
    else errors.push(`${files[i].name}: ${r.reason instanceof Error ? r.reason.message : "no se pudo subir"}`);
  });
  return { urls, errors };
}
