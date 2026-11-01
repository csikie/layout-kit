import { Badge } from "@/components/ui/badge";
import { Row } from "@/components/ui/row";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DocsBreadcrumb } from "./docs-breadcrumb";
import { ThemeToggle } from "./theme-toggle";

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/88 px-4 backdrop-blur-lg">
      <Row justify="between" align="stretch" className="min-h-[calc(--spacing(15)-1px)]">
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
    </header>
  );
}
