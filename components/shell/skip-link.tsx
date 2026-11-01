"use client";

export function SkipLink() {
  return (
    <a
      className="fixed -top-40 left-4 z-60 rounded-[0.3rem] bg-primary p-3 text-primary-foreground focus:top-4"
      href="#main-content"
      onClick={(event) => {
        event.preventDefault();
        document.getElementById("main-content")?.focus();
      }}
    >
      Skip to content
    </a>
  );
}
