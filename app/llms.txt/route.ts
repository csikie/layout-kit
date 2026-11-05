import { navigation } from "@/lib/navigation";
import { siteDescription } from "@/lib/metadata";
import { author, repositoryUrl, siteName, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

/** A documentation index for readers and tools; canonical content remains HTML. */
export function GET() {
  const groups = navigation.map(
    (group) =>
      `## ${group.label}\n\n${group.items
        .map(
          (item) =>
            `- [${item.title}](${new URL(item.href, `${siteUrl}/`).href}): ${item.description}`,
        )
        .join("\n")}`,
  );
  return new Response(
    [
      `# ${siteName}`,
      `> ${siteDescription}`,
      "Layout Kit is an MIT-licensed shadcn registry for React 19, TypeScript, and Tailwind CSS 4. The CLI copies source into your project; layout primitives use @base-ui/react for rendering. It is not an npm package or a complete UI design system.",
      `Maintained by ${author.name}. Source, license, and issues: ${repositoryUrl}`,
      ...groups,
    ].join("\n\n") + "\n",
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
}
