import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { MobileBookingBar } from "@/components/layout/MobileBookingBar";
import { LiveRefresh } from "@/components/layout/LiveRefresh";
import { JsonLd } from "@/components/seo/JsonLd";
import { businessJsonLd, websiteJsonLd } from "@/lib/seo";
import { getI18n } from "@/i18n/server";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { t, lang } = await getI18n();
  return (
    <>
      <JsonLd data={businessJsonLd(lang)} />
      <JsonLd data={websiteJsonLd(lang)} />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-ivory"
      >
        {t("Saltar al contenido", "Skip to content")}
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
      <MobileBookingBar />
      <LiveRefresh />
    </>
  );
}
