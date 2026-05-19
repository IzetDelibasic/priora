import axios from "axios";
import type { TriageRequest, TriageResponse } from "@/models/triage";

export type { TriageRequest, TriageResponse };

const API_BASE = "http://localhost:8000/api";

export async function submitTriage(
  data: TriageRequest,
): Promise<TriageResponse> {
  const { data: result } = await axios.post<TriageResponse>(
    `${API_BASE}/triage`,
    data,
  );
  return result;
}
