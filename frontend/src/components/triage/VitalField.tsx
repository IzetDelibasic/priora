import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getVitalStatus } from "@/lib/vitals";
import { VITAL_STATUS_CFG } from "@/constants/vitals";
import type { VitalStatus } from "@/models/vitals";

interface VitalFieldProps {
  label: string;
  name: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function VitalField({
  label,
  name,
  value,
  onChange,
  min,
  max,
  step = 0.1,
}: VitalFieldProps) {
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState("");

  const status: VitalStatus | null = getVitalStatus(name, value);
  const statusCfg = status ? VITAL_STATUS_CFG[status] : null;

  const fireChange = (raw: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = raw === "" ? 0 : parseFloat(raw);
    if (!isNaN(parsed)) {
      const evt = {
        ...e,
        target: { ...e.target, name, value: String(parsed) },
      };
      onChange(evt as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-1 h-5">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider leading-none">
          {label}
        </label>
        {statusCfg ? (
          <span
            className={cn(
              "text-[10px] font-bold px-1.5 py-0.5 rounded border leading-none",
              statusCfg.className,
            )}
          >
            {statusCfg.label}
          </span>
        ) : (
          <span className="invisible text-[10px] px-1.5 py-0.5 border leading-none">
            _
          </span>
        )}
      </div>
      <Input
        type="text"
        inputMode={step && step < 1 ? "decimal" : "numeric"}
        name={name}
        value={focused ? draft : String(value)}
        onChange={(e) => {
          setDraft(e.target.value);
          fireChange(e.target.value, e);
        }}
        onFocus={(e) => {
          setDraft(String(value));
          setFocused(true);
          requestAnimationFrame(() => e.target.select());
        }}
        onBlur={(e) => {
          setFocused(false);
          const parsed = parseFloat(draft);
          if (!isNaN(parsed)) {
            const evt = {
              ...e,
              target: { ...e.target, name, value: String(parsed) },
            };
            onChange(evt as React.ChangeEvent<HTMLInputElement>);
          } else {
            const evt = { ...e, target: { ...e.target, name, value: "0" } };
            onChange(evt as React.ChangeEvent<HTMLInputElement>);
          }
        }}
        min={min}
        max={max}
        required
        className={cn(
          status === "critical" && "border-red-400 focus:ring-red-400",
          status === "warning" && "border-amber-400 focus:ring-amber-400",
          status === "normal" && "border-green-400 focus:ring-green-400",
        )}
      />
    </div>
  );
}
