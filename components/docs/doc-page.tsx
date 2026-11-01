import type { ReactNode } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Grid } from "@/components/ui/grid";
import { Row } from "@/components/ui/row";
import { Stack } from "@/components/ui/stack";
import { adjacentPages } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Eyebrow, Lede, enterAnimation } from "./typography";

export interface TocEntry {
  id: string;
  title: string;
}

export function DocLayout({ children, toc }: { children: ReactNode; toc?: TocEntry[] }) {
  return (
    <Grid gap={12} className="min-[87.5rem]:grid-cols-[minmax(0,1fr)_13rem]">
      <article className={cn("min-w-0", enterAnimation)}>{children}</article>
      {toc && toc.length > 0 && (
        <nav
          aria-label="On this page"
          className="sticky top-24 hidden flex-col gap-[0.35rem] self-start pt-18 text-[0.78rem] min-[87.5rem]:flex"
        >
          <Eyebrow className="mb-2">On this page</Eyebrow>
          {toc.map((entry) => (
            <a
              key={entry.id}
              href={`#${entry.id}`}
              className="border-l py-1 pl-[0.85rem] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            >
              {entry.title}
            </a>
          ))}
        </nav>
      )}
    </Grid>
  );
}

export function DocHeader({
  eyebrow,
  category,
  title,
  description,
  chips,
}: {
  eyebrow: string;
  category?: string;
  title: ReactNode;
  description: ReactNode;
  chips?: string[];
}) {
  return (
    <header className="max-w-184 pt-10 pb-4 sm:pt-14">
      <Row gap={3}>
        <Eyebrow>{eyebrow}</Eyebrow>
        {category && <Badge variant="outline">{category}</Badge>}
      </Row>
      <h1 className="my-4 text-[clamp(2.8rem,6vw,4.8rem)] leading-[1.02] font-medium tracking-[-0.06em]">
        {title}
        <span className="text-sidebar-primary">.</span>
      </h1>
      <p className="max-w-160 text-[1.05rem] leading-[1.75] text-muted-foreground">{description}</p>
      {chips && chips.length > 0 && (
        <Row gap={2} wrap className="mt-5">
          {chips.map((chip, index) => (
            <Badge key={chip} variant={index === 0 ? "secondary" : "outline"}>
              {chip}
            </Badge>
          ))}
        </Row>
      )}
    </header>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  lede,
  aside,
  children,
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mt-10 scroll-mt-24 sm:mt-14" aria-labelledby={`${id}-heading`}>
      <Row align="end" justify="between" wrap className="mb-5 gap-5">
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2
            id={`${id}-heading`}
            className="mt-[0.4rem] text-[clamp(1.4rem,2vw,1.85rem)] font-medium tracking-[-0.04em]"
          >
            {title}
          </h2>
        </div>
        {aside}
      </Row>
      {lede && <Lede>{lede}</Lede>}
      {children}
    </section>
  );
}

export function ExampleGroup({ children }: { children: ReactNode }) {
  return <Stack gap={8}>{children}</Stack>;
}

export function Example({
  title,
  description,
  children,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Stack gap={3}>
      <div>
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        {description && (
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children}
    </Stack>
  );
}

const pageLinkClassName =
  "flex min-w-0 flex-col gap-1 rounded-[0.6rem] border px-4 py-[0.85rem] transition-colors hover:border-foreground hover:bg-muted sm:px-5 sm:py-4";

export function DocPagination({ href }: { href: string }) {
  const { previous, next } = adjacentPages(href);
  return (
    <nav aria-label="Previous and next pages" className="mt-16">
      <Grid cols={2} gap={{ base: 3, sm: 4 }}>
        {previous && (
          <Link href={previous.href} className={pageLinkClassName}>
            <Eyebrow>Previous</Eyebrow>
            <span className="truncate text-sm font-medium">{previous.title}</span>
          </Link>
        )}
        {next && (
          <Link
            href={next.href}
            className={cn(pageLinkClassName, "col-start-2 items-end text-right")}
          >
            <Eyebrow>Next</Eyebrow>
            <span className="truncate text-sm font-medium">{next.title}</span>
          </Link>
        )}
      </Grid>
    </nav>
  );
}
