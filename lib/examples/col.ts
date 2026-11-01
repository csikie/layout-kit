import { layoutImports, uiImport } from "./imports";

export const colSplit = `${layoutImports("Col", "Row", "Stack")}

export function SettingsLayout() {
  return (
    <Row gap={6} align="stretch">
      {/* The rail keeps its width; the content takes whatever is left. */}
      <Col shrink={false} className="w-44">
        <Stack gap={1}>
          {sections.map((section) => (
            <a key={section} className="rounded-md px-2 py-1.5 text-sm hover:bg-muted">
              {section}
            </a>
          ))}
        </Stack>
      </Col>
      <Col grow>
        <Stack gap={4}>
          <h3 className="text-sm font-semibold">Notifications</h3>
          <p className="text-sm text-muted-foreground">
            Choose how you want to hear about activity in your projects.
          </p>
        </Stack>
      </Col>
    </Row>
  );
}`;

export const colMedia = `${layoutImports("Col", "Row", "Stack")}
${uiImport("button", "Button")}

export function AttachmentRow({ file }) {
  return (
    <Row gap={3} align="start">
      <Col shrink={false} className="size-12 rounded-md bg-muted" />
      {/* min-w-0 ships with Col, so the long name truncates instead of overflowing. */}
      <Col grow>
        <Stack gap={1}>
          <span className="truncate text-sm font-medium">{file.name}</span>
          <span className="text-xs text-muted-foreground">{file.size} · {file.updated}</span>
        </Stack>
      </Col>
      <Button variant="ghost" size="icon">
        <HugeiconsIcon icon={Download04Icon} />
      </Button>
    </Row>
  );
}`;

export const colSelf = `${layoutImports("Col", "Row", "Stack")}
${uiImport("button", "Button")}

export function ReviewRequest({ request }) {
  return (
    // The Row aligns children to the top; the button opts back into centering.
    <Row gap={3} align="start">
      <Avatar name={request.author} size="sm" />
      <Col grow>
        <Stack gap={1}>
          <span className="text-sm font-medium">{request.title}</span>
          <span className="text-xs text-muted-foreground">{request.summary}</span>
        </Stack>
      </Col>
      <Col shrink={false} self="center">
        <Button size="sm">Review</Button>
      </Col>
    </Row>
  );
}`;
