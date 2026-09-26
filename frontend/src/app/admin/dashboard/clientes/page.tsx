"use client";

import { useAdminSession } from "@/hooks/useAdminSession";
import { ClientsView } from "@/components/admin/ClientsView";

export default function ClientesPage() {
  const { token } = useAdminSession();
  if (!token) return null;
  return <ClientsView token={token} />;
}
