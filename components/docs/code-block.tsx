import "server-only";
import { highlight, type CodeLanguage } from "@/lib/highlight";
import { Row } from "@/components/ui/row";
import { cn } from "@/lib/utils";
import { CopyButton } from "./copy-button";

interface CodeBlockProps {
  code: string;
  lang?: CodeLanguage;
  title?: string;
  /** Hide the copy affordance when a parent already provides one. */
  copy?: boolean;
  className?: string;
}

// Shiki emits dual-theme HTML with --shiki-light / --shiki-dark custom properties;
// these selectors pick the palette for the active theme.
const codeBlockClassName = cn(
  "relative overflow-hidden rounded-[0.6rem] border bg-muted",
  "[&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:bg-transparent! [&_pre]:px-5 [&_pre]:py-[1.1rem] [&_pre]:font-mono [&_pre]:text-[0.76rem] [&_pre]:leading-[1.8] [&_pre]:[tab-size:2]",
  "[&_pre_code]:block [&_pre_code]:min-w-max",
  "[&_.shiki]:text-(--shiki-light) [&_.shiki_span]:text-(--shiki-light) dark:[&_.shiki]:text-(--shiki-dark) dark:[&_.shiki_span]:text-(--shiki-dark)",
);

/** Server component: highlights once at render time, ships plain HTML to the client. */
export async function CodeBlock({
  code,
  lang = "tsx",
  title,
  copy = true,
  className,
}: CodeBlockProps) {
  const html = await highlight(code, lang);
  return (
    <div className={cn(codeBlockClassName, className)}>
      {title ? (
        <Row
          gap={3}
          justify="between"
          className="border-b py-[0.4rem] pr-2 pl-4 font-mono text-[0.65rem] tracking-[0.05em] text-muted-foreground"
        >
          <span>{title}</span>
          {copy && <CopyButton text={code.trim()} />}
        </Row>
      ) : (
        copy && (
          <div className="absolute top-2 right-2">
            <CopyButton text={code.trim()} />
          </div>
        )
      )}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
