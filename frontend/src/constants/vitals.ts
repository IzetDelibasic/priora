import type { VitalStatus } from "@/models/vitals";
import type { TriageRequest } from "@/models/triage";

export const VITAL_STATUS_CFG: Record<
  VitalStatus,
  { label: string; className: string }
> = {
  normal: {
    label: "Normal",
    className: "text-green-600 bg-green-50 border-green-200",
  },
  warning: {
    label: "Abnormal",
    className: "text-amber-600 bg-amber-50 border-amber-200",
  },
  critical: {
    label: "Critical",
    className: "text-red-600 bg-red-50 border-red-200",
  },
};

export const DEFAULT_FORM: TriageRequest = {
  age: 0,
  pulse: 0,
  sbp: 0,
  dbp: 0,
  temperature: 37.0,
  spo2: 98,
  resprate: 16,
  pain: 0,
  chiefcomplaint: "",
};
