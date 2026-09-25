"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { adminLogin } from "@/lib/api";
import { saveAdminSession } from "@/lib/admin-auth";
import { Button } from "@/components/ui/Button";
import { Grain } from "@/components/ui/Grain";
import { PHOTOS } from "@/lib/photos";
import { fieldClass, labelClass } from "@/lib/ui";

/** Admin sign-in — same light, warm language as the public site (split layout with brand photography). */
export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      setError("Usuario o contraseña incorrectos, o no se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-dvh bg-ivory lg:grid-cols-[1.1fr_1fr]">
      <div className="relative hidden overflow-hidden lg:block">
        <Image src={PHOTOS.suite.src} alt={PHOTOS.suite.alt} fill priority sizes="55vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-12 text-ivory">
          <p className="font-serif text-3xl font-bold tracking-wide">L&apos;AMOUR</p>
          <p className="mt-1 text-[0.65rem] font-medium uppercase tracking-[0.4em] text-champagne">Estética y Sentidos</p>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-ivory/80">
            Panel de administración: citas, equipo y catálogo de servicios en un solo lugar.
          </p>
        </div>
      </div>

      <div className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-ivory via-champagne/30 to-silk px-5 py-12">
        <Grain />
        <div className="relative w-full max-w-sm">
          <Link
            href="/"
            className="mb-10 flex min-h-11 w-fit items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
          >
            <ArrowLeft size={15} aria-hidden />
            Volver al sitio
          </Link>

          <p className="eyebrow">Panel admin</p>
          <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-ink">Te damos la bienvenida</h1>
          <p className="mt-2 text-sm text-ink-soft">Ingresa con tu usuario para gestionar L&apos;AMOUR.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className={labelClass}>
              Usuario
              <input
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={fieldClass}
                autoComplete="username"
                autoFocus
                required
              />
            </label>
            <label className={labelClass}>
              Contraseña
              <span className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${fieldClass} pr-12`}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-ink-soft transition-colors hover:text-ink"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </span>
            </label>

            {error && (
              <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden />
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} size="lg" className="w-full">
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden />
                  Ingresando…
                </>
              ) : (
                "Ingresar"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
