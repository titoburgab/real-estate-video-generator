"use client";

import type { MovementId } from "@/lib/types";

const OPTIONS: { id: MovementId; label: string }[] = [
  { id: "zoomIn", label: "Zoom In" },
  { id: "panRight", label: "Pan Right" },
  { id: "panLeft", label: "Pan Left" },
  { id: "zoomOut", label: "Zoom Out" },
];

export function MovementSelector({
  value,
  onChange,
}: {
  value: MovementId;
  onChange: (movement: MovementId) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-1">
      {OPTIONS.map((option) => {
        const selected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            aria-pressed={selected}
            className={`rounded border px-1.5 py-1 font-stamp text-[0.6rem] uppercase tracking-widest transition ${
              selected
                ? "border-stamp bg-stamp/10 text-stamp"
                : "border-brass/40 bg-white/60 text-ink-muted hover:border-stamp hover:text-stamp"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
