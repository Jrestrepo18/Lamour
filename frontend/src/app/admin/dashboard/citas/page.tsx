"use client";

import { useAdminSession } from "@/hooks/useAdminSession";
import { AppointmentsView } from "@/components/admin/AppointmentsView";

export default function CitasPage() {
  const { token } = useAdminSession();
  if (!token) return null;
  return <AppointmentsView token={token} />;
}
