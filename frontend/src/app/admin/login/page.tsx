"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Lock } from "lucide-react";
import { adminLogin } from "@/lib/api";
import { saveAdminSession } from "@/lib/admin-auth";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await adminLogin(username.trim(), password);
      saveAdminSession(res.token, res.fullName);
      router.replace("/admin/dashboard");
    } catch {
      setError("Usuario o contraseña incorrectos, o no se pudo conectar con la API.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl border border-gold/20 bg-[#1c1712] p-8 shadow-2xl"
      >
        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 text-gold">
            <Lock size={24} />
          </span>
          <h1 className="mt-4 font-serif text-2xl text-ivory">L&apos;AMOUR Admin</h1>
          <p className="mt-1 text-xs text-ivory/50">Panel de administración</p>
        </div>

        <div className="mt-8 space-y-4">
          <label className="flex flex-col gap-1.5 text-xs font-sans font-medium text-ivory/60">
            Usuario
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-xl border border-ivory/15 bg-white/5 px-4 py-3 text-sm text-ivory outline-none focus:border-gold"
              autoFocus
              required
            />
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-sans font-medium text-ivory/60">
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-ivory/15 bg-white/5 px-4 py-3 text-sm text-ivory outline-none focus:border-gold"
              required
            />
          </label>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-xs text-red-300">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        <Button type="submit" disabled={loading} className="mt-6 w-full justify-center">
          {loading ? <Loader2 size={16} className="animate-spin" /> : "Ingresar"}
        </Button>
      </form>
    </div>
  );
}
