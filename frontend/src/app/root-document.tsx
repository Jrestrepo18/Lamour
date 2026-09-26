import type { ReactNode } from "react";
import type { Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteGate } from "@/components/gate/SiteGate";
import { LenisProvider } from "@/components/motion/LenisProvider";
import { AGE_GATE_BOOT_SCRIPT } from "@/lib/age-gate";
import { I18nProvider } from "@/i18n/I18nProvider";
import { LOCALE_TAG, type Locale } from "@/i18n/config";

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

export const rootViewport: Viewport = {
  themeColor: "#f5f1e8",
  colorScheme: "light",
  // Lets the sticky mobile booking bar pad itself above the iPhone home indicator.
  viewportFit: "cover",
};

/**
 * The <html> shell shared by the two root layouts — the public site ([lang]) and
 * the admin panel — so fonts, the age-gate boot script and smooth scroll are identical.
 */
export function RootDocument({ lang, children }: { lang: Locale; children: ReactNode }) {
  return (
    // suppressHydrationWarning: the <head> boot script may add data-age-ok before React hydrates.
    <html lang={LOCALE_TAG[lang]} className={`${generalSans.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: AGE_GATE_BOOT_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col bg-ivory text-ink">
        <I18nProvider lang={lang}>
          <LenisProvider>
            <SiteGate>{children}</SiteGate>
          </LenisProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
