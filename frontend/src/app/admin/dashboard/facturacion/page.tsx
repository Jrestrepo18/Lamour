"use client";

import { useAdminSession } from "@/hooks/useAdminSession";
import { BillingView } from "@/components/admin/BillingView";

export default function FacturacionPage() {
  const { token } = useAdminSession();
  if (!token) return null;
  return <BillingView token={token} />;
}
