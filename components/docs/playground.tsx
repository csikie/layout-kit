import type { ReactNode } from "react";

/** One pre-rendered code block per playground state, produced by the server page. */
export interface PlaygroundVariant {
  code: ReactNode;
  source: string;
}
export type PlaygroundVariants<K extends string> = Record<K, PlaygroundVariant>;
