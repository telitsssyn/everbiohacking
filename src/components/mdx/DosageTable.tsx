import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

interface DosageRow {
  name: string;
  dose: string;
  notes?: string;
}

interface DosageTableProps {
  rows?: DosageRow[];
  rowsJson?: string;
  caption?: ReactNode;
}

export function DosageTable({ rows, rowsJson, caption }: DosageTableProps) {
  const t = useTranslations("dosageTable");
  const data: DosageRow[] = rowsJson ? JSON.parse(rowsJson) : (rows || []);

  return (
    <figure className="my-8 overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full text-sm">
        <thead className="bg-white/[0.03]">
          <tr className="text-left text-white/60">
            <th className="px-4 py-3 font-medium">{t("compound")}</th>
            <th className="px-4 py-3 font-medium">{t("dose")}</th>
            <th className="px-4 py-3 font-medium">{t("notes")}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.name} className="border-t border-white/5 text-white/90">
              <td className="px-4 py-3 font-medium">{row.name}</td>
              <td className="px-4 py-3 text-white/80">{row.dose}</td>
              <td className="px-4 py-3 text-white/70">{row.notes ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {caption && (
        <figcaption className="border-t border-white/5 bg-white/[0.02] px-4 py-2 text-xs text-white/50">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
