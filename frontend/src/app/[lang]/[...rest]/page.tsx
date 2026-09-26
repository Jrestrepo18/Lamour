import { notFound } from "next/navigation";

/** Any unmatched URL renders the branded 404 (../not-found.tsx) in the page's language. */
export default function CatchAll() {
  notFound();
}
