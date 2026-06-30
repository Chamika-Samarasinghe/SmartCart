"use client";

import { useState, useTransition } from "react";

export function DeleteButton({
  action,
  label = "item",
}: {
  action: () => Promise<void>;
  label?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    if (!confirm(`Delete this ${label}? This cannot be undone.`)) return;
    setError(null);
    startTransition(async () => {
      try {
        await action();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Delete failed.");
      }
    });
  }

  return (
    <span className="inline-flex flex-col items-end gap-0.5">
      {error && <span className="text-xs text-red-600">{error}</span>}
      <button
        onClick={handleClick}
        disabled={isPending}
        className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors"
      >
        {isPending ? "Deleting…" : "Delete"}
      </button>
    </span>
  );
}
