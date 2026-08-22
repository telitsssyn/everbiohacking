import { Callout } from "./Callout";
import { TLDR } from "./TLDR";
import { DosageTable } from "./DosageTable";
import { References, Reference } from "./References";
import { MedicalDisclaimer } from "./MedicalDisclaimer";
import { YouTube } from "./YouTube";
import { ProtocolSummary } from "./ProtocolSummary";

export const mdxComponents = {
  Callout,
  TLDR,
  DosageTable,
  References,
  Reference,
  MedicalDisclaimer,
  YouTube,
  ProtocolSummary,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-12 font-serif text-2xl font-medium text-white" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-8 font-serif text-xl font-medium text-white/95" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="my-5 text-base leading-relaxed text-white/80" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="underline decoration-white/30 underline-offset-2 hover:text-white"
      {...props}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="my-5 list-disc space-y-2 pl-6 text-white/80" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="my-5 list-decimal space-y-2 pl-6 text-white/80" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="my-6 border-l-2 border-white/30 pl-4 italic text-white/70"
      {...props}
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code
      className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sm text-white/90"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-white/10" />,
};
