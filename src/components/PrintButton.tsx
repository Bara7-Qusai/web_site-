"use client";

import { Icon } from "./Icon";

export function PrintButton({ label }: { label: string }) {
  return (
    <button type="button" onClick={() => window.print()} className="btn btn-primary btn-sm">
      <Icon name="download" className="size-4" />
      {label}
    </button>
  );
}
