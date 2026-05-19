import type { TriageRequest, TriageResponse } from "@/models/triage";
import { CHIEF_COMPLAINTS } from "@/constants/chiefComplaints";

const ESI_COLORS: Record<number, string> = {
  1: "#ef4444",
  2: "#f97316",
  3: "#eab308",
  4: "#22c55e",
  5: "#3b82f6",
};

const ESI_BGS: Record<number, string> = {
  1: "#fef2f2",
  2: "#fff7ed",
  3: "#fefce8",
  4: "#f0fdf4",
  5: "#eff6ff",
};

const ESI_LABELS: Record<number, string> = {
  1: "Hitno",
  2: "Urgentno",
  3: "Žurno",
  4: "Polu-urgentno",
  5: "Nije urgentno",
};

export function buildPrintHtml(
  patientName: string,
  form: TriageRequest,
  result: TriageResponse,
): string {
  const color = ESI_COLORS[result.esi_level];
  const bg = ESI_BGS[result.esi_level];
  const label = ESI_LABELS[result.esi_level];

  const now = new Date().toLocaleString("bs-BA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const vitalRow = (lbl: string, value: string) =>
    `<div class="vital"><div class="vital-label">${lbl}</div><div class="vital-value">${value}</div></div>`;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>Trijažni izvještaj - ${patientName || "Pacijent"}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #e2e8f0; font-family: Arial, sans-serif; min-height: 100vh; }
  .toolbar {
    position: sticky; top: 0; z-index: 100;
    background: #1e293b; color: #f8fafc;
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 24px; gap: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }
  .toolbar-title { font-size: 14px; font-weight: 600; letter-spacing: 0.3px; }
  .toolbar-patient { font-size: 12px; color: #94a3b8; }
  .toolbar-actions { display: flex; gap: 10px; }
  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 16px; border-radius: 6px; font-size: 13px;
    font-weight: 600; cursor: pointer; border: none;
    transition: opacity 0.15s;
  }
  .btn:hover { opacity: 0.85; }
  .btn-print { background: #4f46e5; color: #fff; }
  .btn-close { background: #334155; color: #e2e8f0; }
  .paper-wrap { padding: 36px 24px 60px; }
  .paper {
    background: #fff; max-width: 760px; margin: 0 auto;
    padding: 48px 52px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.18);
    border-radius: 4px;
  }
  h1 { text-align: center; font-size: 20px; letter-spacing: 1px; text-transform: uppercase; padding-bottom: 10px; border-bottom: 2px solid #1e293b; margin-bottom: 18px; color: #0f172a; }
  .meta { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 12.5px; color: #475569; }
  .meta strong { color: #0f172a; }
  .section-title { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 14px; margin-top: 22px; }
  .vitals { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
  .vital { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; }
  .vital-label { font-size: 9.5px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
  .vital-value { font-size: 16px; font-weight: 700; margin-top: 3px; color: #0f172a; }
  .esi-box { border: 2px solid ${color}; background: ${bg}; border-radius: 10px; padding: 18px 22px; margin-top: 12px; }
  .esi-level { font-size: 26px; font-weight: 800; color: ${color}; }
  .esi-label { font-size: 15px; font-weight: 600; color: #1e293b; margin: 4px 0 8px; }
  .recommendation { font-size: 13px; color: #334155; line-height: 1.6; }
  .confidence { font-size: 11.5px; color: #64748b; margin-top: 8px; }
  .probs { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; }
  .prob-item { font-size: 11px; background: #f1f5f9; border-radius: 4px; padding: 3px 8px; color: #475569; }
  .signature { margin-top: 60px; display: flex; justify-content: space-between; }
  .sig-line { width: 220px; border-top: 1px solid #475569; padding-top: 6px; font-size: 11px; color: #64748b; text-align: center; }
  .footer { text-align: center; margin-top: 28px; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
  @media print {
    body { background: #fff; }
    .toolbar { display: none !important; }
    .paper-wrap { padding: 0; }
    .paper { box-shadow: none; border-radius: 0; padding: 0; max-width: 100%; }
  }
</style></head><body>
<div class="toolbar">
  <div>
    <div class="toolbar-title">Trijažni izvještaj</div>
    <div class="toolbar-patient">${patientName ? `Pacijent: ${patientName}` : ""} &nbsp;\u2022&nbsp; ${now}</div>
  </div>
  <div class="toolbar-actions">
    <button class="btn btn-print" onclick="window.print()">\uD83D\uDDB8 &nbsp;Štampaj / Snimi kao PDF</button>
    <button class="btn btn-close" onclick="window.close()">\u2715 &nbsp;Zatvori</button>
  </div>
</div>
<div class="paper-wrap"><div class="paper">
<h1>Trijažni izvještaj</h1>
<div class="meta">
  <div><strong>Pacijent:</strong> ${patientName || "-"}</div>
  <div><strong>Datum i vrijeme:</strong> ${now}</div>
  <div><strong>Sistem:</strong> Priora Trijaža v1.0</div>
</div>
<div class="section-title">Vitalni znaci</div>
<div class="vitals">
  ${vitalRow("Dob", `${form.age} god`)}
  ${vitalRow("Puls", `${form.pulse} otkucaja/min`)}
  ${vitalRow("STA / DTA", `${form.sbp} / ${form.dbp} mmHg`)}
  ${vitalRow("Temperatura", `${form.temperature} \u00b0C`)}
  ${vitalRow("SpO\u2082", `${form.spo2}%`)}
  ${vitalRow("Frekvencija disanja", `${form.resprate} /min`)}
  ${vitalRow("Bol", `${form.pain} / 10`)}
  ${vitalRow("Glavna pritužba", `<span style="font-size:12px">${CHIEF_COMPLAINTS.find((c) => c.value === form.chiefcomplaint)?.label ?? form.chiefcomplaint}</span>`)}
</div>
<div class="section-title">Rezultat trijaže</div>
<div class="esi-box">
  <div class="esi-level">ESI ${result.esi_level} \u2013 ${label}</div>
  <div class="esi-label">${result.label}</div>
  <div class="recommendation">${result.recommendation}</div>
  <div class="confidence">AI pouzdanost: ${result.confidence}%</div>
  <div class="probs">
    ${Object.entries(result.probabilities)
      .map(([l, p]) => `<div class="prob-item">ESI ${l}: ${p}%</div>`)
      .join("")}
  </div>
</div>
<div class="signature">
  <div class="sig-line">Potpis medicinske sestre / kliničara</div>
  <div class="sig-line">Datum i vrijeme potvrde</div>
</div>
<div class="footer">Priora Trijaža &nbsp;\u2022&nbsp; Ovaj izvještaj ne zamjenjuje klinički pregled</div>
</div></div>
</body></html>`;
}
