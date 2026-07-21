"use client";

import { useEffect, useState } from "react";
import type { StatusResponse } from "@/lib/types";

const POLL_INTERVAL_MS = 4000;
const TERMINAL: StatusResponse["status"][] = [
  "complete",
  "error",
  "agent_not_found",
];

const TICKS = Array.from({ length: 12 });

function LeaderRing() {
  return (
    <div className="leader-ring">
      {TICKS.map((_, i) => (
        <span
          key={i}
          className="leader-ring__tick"
          style={
            {
              transform: `rotate(${i * 30}deg)`,
              "--tick-delay": `${i * 0.12}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function StatusPoller({ submissionId }: { submissionId: string }) {
  const [data, setData] = useState<StatusResponse | null>(null);
  const [pollFailed, setPollFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    async function poll() {
      try {
        const res = await fetch(
          `/api/status?submissionId=${encodeURIComponent(submissionId)}`,
          { cache: "no-store" },
        );
        if (cancelled) return;
        const json: StatusResponse = await res.json();
        setData(json);
        setPollFailed(false);
        if (!TERMINAL.includes(json.status)) {
          timer = setTimeout(poll, POLL_INTERVAL_MS);
        }
      } catch {
        if (cancelled) return;
        setPollFailed(true);
        timer = setTimeout(poll, POLL_INTERVAL_MS);
      }
    }

    poll();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [submissionId]);

  const status = data?.status ?? "submitted";
  const isPending = !TERMINAL.includes(status);

  return (
    <div className="flex w-full flex-col items-center gap-6 text-center">
      <p className="font-stamp text-xs uppercase tracking-widest text-room-muted">
        File No. {submissionId.slice(-4)}
      </p>

      {isPending && (
        <>
          <LeaderRing />
          <div>
            <p className="font-display text-2xl text-room-text">
              {status === "rendering" ? "Developing…" : "In the queue…"}
            </p>
            <p className="mt-3 max-w-sm text-room-muted">
              Don&apos;t close this window — your trailer is being cut. This
              usually takes a minute or two.
            </p>
            {pollFailed && (
              <p className="mt-3 text-sm text-projector">
                Having trouble checking in — still watching for an update.
              </p>
            )}
          </div>
        </>
      )}

      {status === "complete" && data?.videoUrl && (
        <div className="marquee-sweep w-full max-w-sm rounded-lg border border-projector/40 bg-room-card px-8 py-10">
          <p className="font-stamp text-xs uppercase tracking-widest text-projector">
            Now showing
          </p>
          <p className="mt-2 font-display text-xl text-room-text">
            Your trailer is ready.
          </p>
          <a
            href={data.videoUrl}
            download
            className="mt-6 inline-block w-full rounded-md bg-projector px-6 py-3 font-stamp text-sm uppercase tracking-widest text-room"
          >
            Download the video
          </a>
        </div>
      )}

      {status === "agent_not_found" && (
        <div className="w-full max-w-sm rounded-lg border border-room-muted/40 bg-room-card px-8 py-10">
          <p className="font-display text-xl text-room-text">
            We couldn&apos;t find your agent profile.
          </p>
          <p className="mt-3 text-room-muted">
            The email on this submission isn&apos;t in the agent roster yet.
            Check with whoever manages your roster, then submit again.
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="w-full max-w-sm rounded-lg border border-stamp/50 bg-room-card px-8 py-10">
          <p className="font-display text-xl text-room-text">
            The cut didn&apos;t come together.
          </p>
          <p className="mt-3 text-room-muted">
            {data?.errorMessage ??
              "Something went wrong rendering this video. Try submitting again."}
          </p>
        </div>
      )}
    </div>
  );
}
