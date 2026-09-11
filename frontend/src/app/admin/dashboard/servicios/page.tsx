"use client";

import { useAdminSession } from "@/hooks/useAdminSession";
import { ServicesView } from "@/components/admin/ServicesView";

export default function ServiciosPage() {
  const { token } = useAdminSession();
  if (!token) return null;
  return <ServicesView token={token} />;
}
