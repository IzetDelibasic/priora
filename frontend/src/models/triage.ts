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
