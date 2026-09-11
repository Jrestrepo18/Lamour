"use client";

import { useAdminSession } from "@/hooks/useAdminSession";
import { MasseusesView } from "@/components/admin/MasseusesView";

export default function MasajistasPage() {
  const { token } = useAdminSession();
  if (!token) return null;
  return <MasseusesView token={token} />;
}
