"use client";

import { Loader2 } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";
import { Sidebar } from "@/components/admin/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { ready, fullName } = useAdminSession();

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-ivory" role="status" aria-label="Cargando panel">
        <Loader2 className="animate-spin text-bronze" size={28} aria-hidden />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-ivory via-ivory to-champagne/25 lg:flex">
      <Sidebar fullName={fullName} />
      <main className="min-w-0 flex-1 px-5 pb-28 pt-6 sm:px-10 sm:pt-10 lg:py-12">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
