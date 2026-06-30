import { SECTIONS, type Section } from "./types";

export { SECTIONS };
export type { Section };

export function isSection(value: string): value is Section {
  return (SECTIONS as readonly string[]).includes(value);
}
