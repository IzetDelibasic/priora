import type { VitalStatus } from "@/models/vitals";

export type { VitalStatus };

export function getVitalStatus(
  name: string,
  value: number,
): VitalStatus | null {
  if (value === 0 && name !== "pain") return null;
  switch (name) {
    case "pulse":
      if (value < 40 || value > 130) return "critical";
      if (value < 60 || value > 100) return "warning";
      return "normal";
    case "sbp":
      if (value < 80 || value > 180) return "critical";
      if (value < 90 || value > 140) return "warning";
      return "normal";
    case "dbp":
      if (value < 50 || value > 110) return "critical";
      if (value < 60 || value > 90) return "warning";
      return "normal";
    case "temperature":
      if (value < 35.0 || value > 39.5) return "critical";
      if (value < 36.0 || value > 38.0) return "warning";
      return "normal";
    case "spo2":
      if (value < 90) return "critical";
      if (value < 95) return "warning";
      return "normal";
    case "resprate":
      if (value < 8 || value > 30) return "critical";
      if (value < 12 || value > 20) return "warning";
      return "normal";
    case "pain":
      if (value >= 8) return "critical";
      if (value >= 5) return "warning";
      if (value > 0) return "normal";
      return null;
    default:
      return null;
  }
}

export { VITAL_STATUS_CFG, DEFAULT_FORM } from "@/constants/vitals";
