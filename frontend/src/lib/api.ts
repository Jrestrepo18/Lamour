import { MOCK_CATEGORIES, MOCK_MASSEUSES } from "./mock-data";
import type {
  Appointment,
  AppointmentConfirmationResult,
  AppointmentCreatePayload,
  AvailabilitySlot,
  Masseuse,
  MasseuseAdmin,
  Service,
  ServiceCategory,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5080/api";

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
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ApiError(body || `Error ${res.status}`, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

/** True when the .NET API isn't reachable — lets the UI fall back to demo data instead of a blank page. */
function isConnectionFailure(err: unknown) {
  return !(err instanceof ApiError);
}

// ---------- Public catalog ----------

export async function getServiceCategories(): Promise<{ data: ServiceCategory[]; isDemo: boolean }> {
  try {
    const data = await request<ServiceCategory[]>("/service-categories");
    return { data, isDemo: false };
  } catch (err) {
    if (!isConnectionFailure(err)) throw err;
    console.warn("[api] No se pudo conectar con el backend, usando catálogo de demostración.");
    return { data: MOCK_CATEGORIES, isDemo: true };
  }
}

export async function getMasseuses(): Promise<{ data: Masseuse[]; isDemo: boolean }> {
  try {
    const data = await request<Masseuse[]>("/masseuses");
    return { data, isDemo: false };
  } catch (err) {
    if (!isConnectionFailure(err)) throw err;
    console.warn("[api] No se pudo conectar con el backend, usando masajistas de demostración.");
    return { data: MOCK_MASSEUSES, isDemo: true };
  }
}

export async function getAvailability(
  masseuseId: number,
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

export async function adminUpdateAppointmentStatus(id: number, status: string, token: string) {
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
  payload: Omit<MasseuseAdmin, "id">,
  token: string,
  id?: number,
) {
  return request<MasseuseAdmin>(
    id ? `/admin/masseuses/${id}` : "/admin/masseuses",
    { method: id ? "PUT" : "POST", body: JSON.stringify(payload) },
    token,
  );
}

export async function adminDeleteMasseuse(id: number, token: string) {
  return request<void>(`/admin/masseuses/${id}`, { method: "DELETE" }, token);
}

export async function adminGetServices(token: string) {
  return request<Service[]>("/admin/services", {}, token);
}

export async function adminUpsertService(payload: Omit<Service, "id" | "highlights"> & { highlights: string[] }, token: string, id?: number) {
  return request<Service>(
    id ? `/admin/services/${id}` : "/admin/services",
    { method: id ? "PUT" : "POST", body: JSON.stringify(payload) },
    token,
  );
}

export async function adminDeleteService(id: number, token: string) {
  return request<void>(`/admin/services/${id}`, { method: "DELETE" }, token);
}
