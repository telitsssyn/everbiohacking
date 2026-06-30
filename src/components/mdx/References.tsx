import { Children, cloneElement, isValidElement, type ReactNode } from "react";
import { useTranslations } from "next-intl";

interface ReferenceProps {
  authors?: string;
  title: string;
  journal?: string;
  year?: number | string;
  url?: string;
  index?: number;
}

export function Reference({
  authors,
  title,
  journal,
  year,
  url,
  index,
}: ReferenceProps) {
  return (
    <li className="flex gap-3">
      {index !== undefined && (
        <span className="text-white/40">{index}.</span>
      )}
      <span>
        {authors && <span>{authors}. </span>}
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-white/30 underline-offset-2 hover:text-white"
          >
            {title}
          </a>
        ) : (
          <span className="text-white/90">{title}</span>
        )}
        {journal && <span>. {journal}</span>}
        {year && <span> ({year})</span>}
        <span>.</span>
      </span>
    </li>
  );
}

interface ReferencesProps {
  children: ReactNode;
}

export function References({ children }: ReferencesProps) {
  const t = useTranslations("references");
  const numbered = Children.toArray(children)
    .filter((child): child is React.ReactElement<ReferenceProps> =>
      isValidElement<ReferenceProps>(child),
    )
    .map((child, i) => cloneElement(child, { index: i + 1 }));

  return (
    <section className="mt-12 border-t border-white/10 pt-8">
      <h2 className="font-serif text-xl text-white/90">{t("title")}</h2>
      <ol className="mt-4 space-y-3 text-sm leading-relaxed text-white/70">
        {numbered}
      </ol>
    </section>
  );
}
