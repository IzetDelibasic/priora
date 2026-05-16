import { useState } from "react";
import {
  submitTriage,
  type TriageRequest,
  type TriageResponse,
} from "../api/triage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Activity, AlertTriangle, CheckCircle, Info } from "lucide-react";

const ESI_CONFIG: Record<
  number,
  {
    bg: string;
    border: string;
    badge: string;
    text: string;
    bar: string;
    icon: React.ReactNode;
    label: string;
  }
> = {
  1: {
    bg: "bg-red-50",
    border: "border-red-300",
    badge: "bg-red-600 text-white",
    text: "text-red-700",
    bar: "bg-red-500",
    icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
    label: "Immediate",
  },
  2: {
    bg: "bg-orange-50",
    border: "border-orange-300",
    badge: "bg-orange-500 text-white",
    text: "text-orange-700",
    bar: "bg-orange-500",
    icon: <AlertTriangle className="h-5 w-5 text-orange-500" />,
    label: "Emergent",
  },
  3: {
    bg: "bg-yellow-50",
    border: "border-yellow-300",
    badge: "bg-yellow-500 text-white",
    text: "text-yellow-700",
    bar: "bg-yellow-400",
    icon: <Activity className="h-5 w-5 text-yellow-600" />,
    label: "Urgent",
  },
  4: {
    bg: "bg-green-50",
    border: "border-green-300",
    badge: "bg-green-600 text-white",
    text: "text-green-700",
    bar: "bg-green-500",
    icon: <CheckCircle className="h-5 w-5 text-green-600" />,
    label: "Semi-urgent",
  },
  5: {
    bg: "bg-blue-50",
    border: "border-blue-300",
    badge: "bg-blue-500 text-white",
    text: "text-blue-700",
    bar: "bg-blue-400",
    icon: <Info className="h-5 w-5 text-blue-500" />,
    label: "Non-urgent",
  },
};

const DEFAULT_FORM: TriageRequest = {
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

export function TriageForm() {
  const [form, setForm] = useState<TriageRequest>(DEFAULT_FORM);
  const [result, setResult] = useState<TriageResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "chiefcomplaint" ? value : parseFloat(value) || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await submitTriage(form);
      setResult(res);
    } catch {
      setError(
        "Failed to assess triage. Make sure the backend is running and the model is trained.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setForm(DEFAULT_FORM);
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
          <Activity className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Triage Assessment
          </h1>
          <p className="text-slate-500 text-sm">
            Enter patient vitals to determine ESI triage level
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Patient Vitals</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Field
                label="Age (years)"
                name="age"
                value={form.age}
                onChange={handleChange}
                min={0}
                max={120}
                step={1}
              />
              <Field
                label="Heart Rate (bpm)"
                name="pulse"
                value={form.pulse}
                onChange={handleChange}
                min={0}
                max={300}
              />
              <Field
                label="Systolic BP"
                name="sbp"
                value={form.sbp}
                onChange={handleChange}
                min={0}
                max={300}
              />
              <Field
                label="Diastolic BP"
                name="dbp"
                value={form.dbp}
                onChange={handleChange}
                min={0}
                max={200}
              />
              <Field
                label="Temperature (°C)"
                name="temperature"
                value={form.temperature}
                onChange={handleChange}
                min={30}
                max={45}
                step={0.1}
              />
              <Field
                label="SpO₂ (%)"
                name="spo2"
                value={form.spo2}
                onChange={handleChange}
                min={0}
                max={100}
              />
              <Field
                label="Resp. Rate"
                name="resprate"
                value={form.resprate}
                onChange={handleChange}
                min={0}
                max={60}
              />
              <Field
                label="Pain (0–10)"
                name="pain"
                value={form.pain}
                onChange={handleChange}
                min={0}
                max={10}
                step={1}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Chief Complaint
              </label>
              <Textarea
                name="chiefcomplaint"
                placeholder="e.g. chest pain, shortness of breath, altered consciousness..."
                value={form.chiefcomplaint}
                onChange={handleChange}
                rows={2}
                required
              />
            </div>

            <div className="flex gap-2.5 pt-1">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 sm:flex-none sm:px-8"
              >
                {isLoading ? "Assessing..." : "Assess Triage"}
              </Button>
              <Button type="button" variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {error && (
        <div className="flex items-start gap-2.5 text-red-700 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {result &&
        (() => {
          const cfg = ESI_CONFIG[result.esi_level];
          return (
            <Card className={cn("border-2", cfg.bg, cfg.border)}>
              <CardContent className="pt-5 space-y-4">
                <div className="flex flex-wrap items-start gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    {cfg.icon}
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "rounded-full px-3 py-0.5 text-xs font-bold",
                            cfg.badge,
                          )}
                        >
                          ESI {result.esi_level}
                        </span>
                        <span className={cn("font-bold text-base", cfg.text)}>
                          {result.label}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                        {result.recommendation}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="shrink-0 font-semibold">
                    {result.confidence}% confidence
                  </Badge>
                </div>

                <div className="space-y-2 pt-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Probability Distribution
                  </p>
                  {Object.entries(result.probabilities).map(([level, pct]) => {
                    const c = ESI_CONFIG[Number(level)];
                    return (
                      <div key={level} className="flex items-center gap-3">
                        <span
                          className={cn(
                            "text-xs font-medium w-6 text-center rounded py-0.5",
                            c.badge,
                          )}
                        >
                          {level}
                        </span>
                        <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className={cn(
                              "h-2 rounded-full transition-all duration-500",
                              c.bar,
                            )}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500 w-10 text-right font-medium">
                          {pct}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })()}
    </div>
  );
}

interface FieldProps {
  label: string;
  name: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
}

function Field({
  label,
  name,
  value,
  onChange,
  min,
  max,
  step = 0.1,
}: FieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        {label}
      </label>
      <Input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        required
      />
    </div>
  );
}
