import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteGate } from "@/components/gate/SiteGate";
import { LenisProvider } from "@/components/motion/LenisProvider";

/**
 * One family, used at contrasting weights (400 body / 700 display) instead
 * of two separate typefaces — General Sans reads warm, rounded and modern at
 * both ends, which is what the brand actually wanted once seen live. Bodoni
 * Moda (thin, high-contrast editorial serif) tested wrong in practice, even
 * though it was the approved pick on paper.
 */
const generalSans = localFont({
  variable: "--font-general-sans",
  src: [
    { path: "../fonts/general-sans/GeneralSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/general-sans/GeneralSans-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/general-sans/GeneralSans-Semibold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/general-sans/GeneralSans-Bold.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
});

export const metadata: Metadata = {
  title: "L'AMOUR — Estética y Sentidos | Spa a domicilio en Medellín",
  description:
    "Masajes tántricos, terapias de relajación, experiencias en pareja y recuperación muscular a domicilio en Medellín y su área metropolitana. Reserva tu ritual L'AMOUR.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${generalSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-ivory text-ink">
        <LenisProvider>
          <SiteGate>{children}</SiteGate>
        </LenisProvider>
      </body>
    </html>
  );
}
