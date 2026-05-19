export type VitalStatus = "normal" | "warning" | "critical";

export interface EsiCfg {
  bg: string;
  border: string;
  badge: string;
  text: string;
  bar: string;
  icon: React.ReactNode;
  label: string;
}
