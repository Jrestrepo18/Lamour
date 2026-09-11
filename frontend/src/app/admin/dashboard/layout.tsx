"use client";

import { Loader2 } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";
import { Sidebar } from "@/components/admin/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { ready, fullName } = useAdminSession();

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory">
        <Loader2 className="animate-spin text-gold" size={28} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-ivory">
      <Sidebar fullName={fullName} />
      <main className="flex-1 overflow-x-hidden px-6 py-8 sm:px-10 sm:py-10">{children}</main>
    </div>
  );
}
