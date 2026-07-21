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
  realtorPhotoUrl: string;
  keyFeatures: string;
  description: string;
}

export interface IntakeResponse {
  submissionId: string;
  status: string;
}

export type JobStatus =
  | "submitted"
  | "rendering"
  | "complete"
  | "error"
  | "agent_not_found";

export interface StatusResponse {
  status: JobStatus;
  videoUrl?: string;
  errorMessage?: string;
}
