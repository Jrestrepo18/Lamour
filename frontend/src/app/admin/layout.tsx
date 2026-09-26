import type { Metadata } from "next";
import { RootDocument, rootViewport } from "../root-document";
import { SITE } from "@/lib/seo";

export const viewport = rootViewport;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: "Panel Admin | L'AMOUR",
  robots: { index: false, follow: false },
};

/** The admin panel is its own root layout (Spanish only), next to the bilingual site. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument lang="es">{children}</RootDocument>;
}
