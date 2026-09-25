import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteGate } from "@/components/gate/SiteGate";
import { LenisProvider } from "@/components/motion/LenisProvider";
import { AGE_GATE_BOOT_SCRIPT } from "@/lib/age-gate";
import { SITE } from "@/lib/seo";

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
  metadataBase: new URL(SITE.url),
  title: {
    default: "L'AMOUR | Spa y masajes a domicilio en Medellín",
    template: "%s | L'AMOUR Medellín",
  },
  description: SITE.description,
  applicationName: SITE.shortName,
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  category: "health & beauty",
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: "/",
    siteName: SITE.name,
    title: "L'AMOUR | Spa y masajes a domicilio en Medellín",
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "L'AMOUR | Spa y masajes a domicilio en Medellín",
    description: SITE.description,
  },
  // No index/follow here: indexable is already the default, and declaring it at the root
  // leaked "index, follow" into the 404 next to Next's own "noindex". Canonicals are set
  // per page for the same reason (a root canonical made every page without one claim "/").
  robots: { googleBot: { "max-image-preview": "large", "max-snippet": -1 } },
  ...(SITE.googleVerification ? { verification: { google: SITE.googleVerification } } : {}),
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f5f1e8",
  colorScheme: "light",
  // Lets the sticky mobile booking bar pad itself above the iPhone home indicator.
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the <head> boot script may add data-age-ok before React hydrates.
    <html lang="es-CO" className={`${generalSans.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: AGE_GATE_BOOT_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col bg-ivory text-ink">
        <LenisProvider>
          <SiteGate>{children}</SiteGate>
        </LenisProvider>
      </body>
    </html>
  );
}
