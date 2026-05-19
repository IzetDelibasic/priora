import { useState } from "react";
import { submitTriage } from "../api/triage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, HelpCircle, User, X } from "lucide-react";
import { DEFAULT_FORM } from "@/constants/vitals";
import { buildPrintHtml } from "@/lib/print-report";
import type { TriageRequest, TriageResponse } from "@/models/triage";
import { VitalField } from "./triage/VitalField";
import { HelpPanel } from "./triage/HelpPanel";
import { TriageResult } from "./triage/TriageResult";
import { TriageResultSkeleton } from "./triage/TriageResultSkeleton";
import { PainSlider } from "./triage/PainSlider";
import { ChiefComplaintSelect } from "./triage/ChiefComplaintSelect";

export function TriageForm() {
  const [patientName, setPatientName] = useState("");
  const [showHelp, setShowHelp] = useState(false);
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
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.chiefcomplaint) {
      setError("Please select a chief complaint before assessing.");
      return;
    }
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
    setPatientName("");
  };

  const handlePrint = () => {
    if (!result) return;
    const html = buildPrintHtml(patientName, form, result);
    const w = window.open("", "_blank", "width=800,height=900");
    if (!w) return;
    w.document.write(html);
    w.document.close();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-5">
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
          <div className="flex items-center justify-between">
            <CardTitle>Patient Vitals</CardTitle>
            <button
              type="button"
              onClick={() => setShowHelp((v) => !v)}
              className="text-slate-400 hover:text-indigo-600 transition-colors"
              aria-label="Field descriptions"
            >
              {showHelp ? (
                <X className="h-5 w-5" />
              ) : (
                <HelpCircle className="h-5 w-5" />
              )}
            </button>
          </div>
          {showHelp && <HelpPanel />}
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> Patient Name
              </label>
              <Input
                type="text"
                placeholder="Enter patient name..."
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <VitalField
                label="Age (years)"
                name="age"
                value={form.age}
                onChange={handleChange}
                min={0}
                max={120}
                step={1}
              />
              <VitalField
                label="Heart Rate (bpm)"
                name="pulse"
                value={form.pulse}
                onChange={handleChange}
                min={0}
                max={300}
              />
              <VitalField
                label="Systolic BP"
                name="sbp"
                value={form.sbp}
                onChange={handleChange}
                min={0}
                max={300}
              />
              <VitalField
                label="Diastolic BP"
                name="dbp"
                value={form.dbp}
                onChange={handleChange}
                min={0}
                max={200}
              />
              <VitalField
                label="Temperature (°C)"
                name="temperature"
                value={form.temperature}
                onChange={handleChange}
                min={30}
                max={45}
                step={0.1}
              />
              <VitalField
                label="SpO₂ (%)"
                name="spo2"
                value={form.spo2}
                onChange={handleChange}
                min={0}
                max={100}
              />
              <VitalField
                label="Resp. Rate"
                name="resprate"
                value={form.resprate}
                onChange={handleChange}
                min={0}
                max={60}
              />
            </div>

            <PainSlider
              value={form.pain}
              onChange={(v) => setForm((prev) => ({ ...prev, pain: v }))}
            />

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Chief Complaint
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <ChiefComplaintSelect
                value={form.chiefcomplaint}
                onChange={(v) =>
                  setForm((prev) => ({ ...prev, chiefcomplaint: v }))
                }
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

      {isLoading && <TriageResultSkeleton />}

      {result && !isLoading && (
        <TriageResult result={result} onPrint={handlePrint} />
      )}
    </div>
  );
}
