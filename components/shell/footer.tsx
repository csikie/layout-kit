import { Row } from "@/components/ui/row";
import { Separator } from "@/components/ui/separator";
import { author, repositoryUrl } from "@/lib/site";

const links = [
  { label: "GitHub", href: repositoryUrl },
  { label: "Registry", href: "/r/registry.json" },
  { label: "Report an issue", href: `${repositoryUrl}/issues` },
];

const linkClassName = "text-foreground underline-offset-3 hover:underline";

function external(href: string) {
  return href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {};
}

export function Footer() {
  return (
    <footer className="mt-16 pb-8">
      <Separator />
      <Row justify="between" wrap className="pt-6 text-[0.7rem] text-muted-foreground">
        <p>
          © {new Date().getFullYear()}{" "}
          <a href={author.url} className={linkClassName} {...external(author.url)}>
            {author.name}
          </a>
          . Released under the{" "}
          <a
            href={`${repositoryUrl}/blob/main/LICENSE`}
            className={linkClassName}
            {...external(repositoryUrl)}
          >
            MIT License
          </a>
          .
        </p>
        <nav aria-label="Project links">
          <Row render={<ul />} wrap className="gap-5">
            {links.map((link) => (
              <li key={link.label}>
                <a href={link.href} className={linkClassName} {...external(link.href)}>
                  {link.label}
                </a>
              </li>
            ))}
          </Row>
        </nav>
      </Row>
    </footer>
  );
}
