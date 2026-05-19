import type { VitalStatus } from "@/models/vitals";

export type { VitalStatus };

// Returns the clinical status of a single vital sign based on evidence-based
// thresholds. Returns null when the value is 0 (not yet entered) for most
// fields, or when the field name is not recognised.
export function getVitalStatus(
  name: string,
  value: number,
): VitalStatus | null {
  // Skip classification for fields that haven't been filled in yet.
  if (value === 0 && name !== "pain") return null;
  switch (name) {
    case "pulse":
      // Critical: bradycardia <40 or tachycardia >130 bpm
      if (value < 40 || value > 130) return "critical";
      // Warning: outside normal sinus range 60-100 bpm
      if (value < 60 || value > 100) return "warning";
      return "normal";
    case "sbp":
      // Critical: hypotension <80 or hypertensive crisis >180 mmHg
      if (value < 80 || value > 180) return "critical";
      if (value < 90 || value > 140) return "warning";
      return "normal";
    case "dbp":
      if (value < 50 || value > 110) return "critical";
      if (value < 60 || value > 90) return "warning";
      return "normal";
    case "temperature":
      // Critical: hypothermia <35°C or high fever >39.5°C
      if (value < 35.0 || value > 39.5) return "critical";
      if (value < 36.0 || value > 38.0) return "warning";
      return "normal";
    case "spo2":
      // Critical: SpO2 <90% indicates severe hypoxia
      if (value < 90) return "critical";
      if (value < 95) return "warning";
      return "normal";
    case "resprate":
      // Critical: apnoea risk <8 or respiratory distress >30 breaths/min
      if (value < 8 || value > 30) return "critical";
      if (value < 12 || value > 20) return "warning";
      return "normal";
    case "pain":
      // Pain is always entered so no zero-skip; severity bands 0-10
      if (value >= 8) return "critical";
      if (value >= 5) return "warning";
      if (value > 0) return "normal";
      return null;
    default:
      return null;
  }
}

export { VITAL_STATUS_CFG, DEFAULT_FORM } from "@/constants/vitals";
