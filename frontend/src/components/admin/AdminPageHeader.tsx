import type { ReactNode } from "react";

/** Title block shared by every admin view — same eyebrow + heading language as the public PageHeader. */
export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-5 border-b border-ink/10 pb-8">
      <div>
        <p className="eyebrow">Panel admin</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-ink">{title}</h1>
        <p className="mt-2 text-sm text-ink-soft">{description}</p>
      </div>
      {action}
    </div>
  );
}
