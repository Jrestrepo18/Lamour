"use client";

import { useAdminSession } from "@/hooks/useAdminSession";
import { ReviewsView } from "@/components/admin/ReviewsView";

export default function ResenasPage() {
  const { token } = useAdminSession();
  if (!token) return null;
  return <ReviewsView token={token} />;
}
