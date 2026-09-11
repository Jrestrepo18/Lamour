"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminName, getAdminToken } from "@/lib/admin-auth";

export function useAdminSession() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const t = getAdminToken();
    if (!t) {
      router.replace("/admin/login");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads localStorage (external system) once on mount
    setToken(t);
    setFullName(getAdminName());
    setChecked(true);
  }, [router]);

  return { token, fullName, ready: checked && !!token };
}
