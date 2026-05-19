import axios from "axios";
import type { TriageRequest, TriageResponse } from "@/models/triage";

export type { TriageRequest, TriageResponse };

// Base URL is read from the environment variable set in .env so the API
// endpoint can be changed per environment without touching source code.
const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Sends patient vitals to the backend triage endpoint and returns the
// ESI level, label, confidence score and per-level probability distribution.
export async function submitTriage(
  data: TriageRequest,
): Promise<TriageResponse> {
  const { data: result } = await axios.post<TriageResponse>(
    `${API_BASE}/triage`,
    data,
  );
  return result;
}
