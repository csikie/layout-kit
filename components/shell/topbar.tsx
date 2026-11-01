import { Badge } from "@/components/ui/badge";
import { Row } from "@/components/ui/row";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DocsBreadcrumb } from "./docs-breadcrumb";
import { ThemeToggle } from "./theme-toggle";

export function Topbar() {
  return (
    <Row
      render={<header />}
      justify="between"
      align="stretch"
      className="sticky top-0 z-20 min-h-15 border-b bg-background/88 px-4 backdrop-blur-lg"
    >
      <Row gap={2}>
        <SidebarTrigger aria-label="Toggle documentation navigation" />
        <Separator orientation="vertical" />
        <DocsBreadcrumb />
      </Row>
      <Row gap={3}>
        <Badge variant="outline" className="hidden sm:inline-flex">
          Open source · MIT
        </Badge>
        <ThemeToggle />
      </Row>
    </Row>
  );
}
