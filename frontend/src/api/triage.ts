import axios from "axios";

const API_BASE = "http://localhost:8000/api";

export interface TriageRequest {
  age: number;
  pulse: number;
  sbp: number;
  dbp: number;
  temperature: number;
  spo2: number;
  resprate: number;
  pain: number;
  chiefcomplaint: string;
}

export interface TriageResponse {
  esi_level: number;
  label: string;
  color: string;
  confidence: number;
  probabilities: Record<number, number>;
  recommendation: string;
}

export async function submitTriage(
  data: TriageRequest,
): Promise<TriageResponse> {
  const { data: result } = await axios.post<TriageResponse>(
    `${API_BASE}/triage`,
    data,
  );
  return result;
}
