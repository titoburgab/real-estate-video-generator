"use server";

import type { IntakePayload, IntakeResponse } from "@/lib/types";

export async function submitIntake(
  payload: IntakePayload,
): Promise<IntakeResponse> {
  const res = await fetch(process.env.N8N_INTAKE_WEBHOOK_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Intake submission failed (${res.status})`);
  }

  return res.json();
}
