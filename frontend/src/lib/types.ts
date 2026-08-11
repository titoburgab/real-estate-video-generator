export type MovementId = "zoomIn" | "panRight" | "panLeft" | "zoomOut";

export interface IntakePayload {
  submitterEmail: string;
  address: string;
  price: string;
  beds: string;
  baths: string;
  sqft: string;
  yearBuilt: string;
  photo1Url: string;
  photo2Url: string;
  photo3Url: string;
  photo4Url: string;
  realtorPhotoUrl: string;
  movement1: MovementId;
  movement2: MovementId;
  movement3: MovementId;
  movement4: MovementId;
  keyFeatures: string;
  description: string;
}

export interface IntakeResponse {
  submissionId: string;
  status: string;
}

export type JobStatus =
  | "submitted"
  | "animating"
  | "rendering"
  | "complete"
  | "error"
  | "agent_not_found";

export interface StatusResponse {
  status: JobStatus;
  videoUrl?: string;
  errorMessage?: string;
}
