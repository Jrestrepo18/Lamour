import type { Metadata } from "next";
import { Bodoni_Moda } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { SiteGate } from "@/components/gate/SiteGate";
import { LenisProvider } from "@/components/motion/LenisProvider";

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

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
    <html lang="es" className={`${bodoniModa.variable} ${generalSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-ivory text-ink">
        <LenisProvider>
          <SiteGate>{children}</SiteGate>
        </LenisProvider>
      </body>
    </html>
  );
}
