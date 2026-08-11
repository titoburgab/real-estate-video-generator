"use client";

import { useEffect, useRef, useState } from "react";

export function PhotoTile({
  label,
  sublabel,
  file,
  onChange,
}: {
  label: string;
  sublabel?: string;
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className="group relative flex aspect-[4/3] w-full flex-col items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-brass/50 bg-paper-card/60 text-ink-muted transition hover:border-stamp hover:text-stamp"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      {previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl}
          alt={`${label} preview`}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <span className="font-stamp text-2xl">+</span>
      )}
      <span
        className={`relative z-10 mt-2 font-stamp text-[0.65rem] uppercase tracking-widest ${
          previewUrl
            ? "rounded bg-ink/70 px-2 py-0.5 text-paper-card"
            : ""
        }`}
      >
        {label}
      </span>
      {sublabel && !previewUrl && (
        <span className="relative z-10 text-[0.6rem] text-ink-muted/70">
          {sublabel}
        </span>
      )}
    </button>
  );
}
