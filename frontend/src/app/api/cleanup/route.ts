import { NextRequest, NextResponse } from "next/server";
import { del, list } from "@vercel/blob";

// Source photos are only needed until Higgsfield + Creatomate finish (well
// under an hour), so anything older than this is safe to delete.
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

// Invoked daily by Vercel Cron (see vercel.json), which sends
// `Authorization: Bearer $CRON_SECRET`. Fails closed if the secret is unset.
export async function GET(request: NextRequest): Promise<NextResponse> {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const cutoff = Date.now() - MAX_AGE_MS;
  const stale: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ cursor, limit: 1000 });
    for (const blob of page.blobs) {
      if (blob.uploadedAt.getTime() < cutoff) stale.push(blob.url);
    }
    cursor = page.cursor;
  } while (cursor);

  if (stale.length > 0) await del(stale);
  return NextResponse.json({ deleted: stale.length });
}
