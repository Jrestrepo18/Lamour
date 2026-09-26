import { getI18n } from "@/i18n/server";

/** Native <details> accordion — every answer is in the HTML, readable without JavaScript. */
export async function FaqList({ faqs, title }: { faqs: { q: string; a: string }[]; title?: string }) {
  const { t } = await getI18n();
  title ??= t("Preguntas frecuentes", "Frequently asked questions");
  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h2>
      <div className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
        {faqs.map((f) => (
          <details key={f.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold text-ink [&::-webkit-details-marker]:hidden">
              <h3 className="text-base">{f.q}</h3>
              <span aria-hidden className="mt-0.5 text-xl leading-none text-bronze transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft sm:text-base">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
