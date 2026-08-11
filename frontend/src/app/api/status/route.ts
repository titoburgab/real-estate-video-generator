import { NextRequest, NextResponse } from "next/server";
import type { StatusResponse } from "@/lib/types";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const submissionId = request.nextUrl.searchParams.get("submissionId");

  if (!submissionId) {
    return NextResponse.json(
      { error: "submissionId is required" },
      { status: 400 },
    );
  }

  const url = `${process.env.N8N_STATUS_WEBHOOK_URL}?submissionId=${encodeURIComponent(submissionId)}`;
  const res = await fetch(url, { cache: "no-store" });

  if (res.status === 404) {
    // The intake workflow responds with a submissionId before its Data Table
    // row write completes (the two happen in parallel). A 404 here can mean
    // "row not written yet" rather than a real error, so treat it as pending.
    return NextResponse.json<StatusResponse>({ status: "submitted" });
  }

  if (!res.ok) {
    return NextResponse.json({ error: "status check failed" }, { status: 502 });
  }

  const data: StatusResponse = await res.json();
  return NextResponse.json(data);
}
