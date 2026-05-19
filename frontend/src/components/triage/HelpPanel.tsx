export function HelpPanel() {
  return (
    <div className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-xs text-slate-600 space-y-1.5">
      <p className="font-semibold text-indigo-700 mb-2">Field Reference</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
        <div>
          <span className="font-semibold text-slate-700">Age</span> — Patient
          age in years (0-120)
        </div>
        <div>
          <span className="font-semibold text-slate-700">Heart Rate</span> —
          Beats per minute. Normal: 60-100 bpm
        </div>
        <div>
          <span className="font-semibold text-slate-700">Systolic BP</span> —
          Peak blood pressure. Normal: 90-140 mmHg
        </div>
        <div>
          <span className="font-semibold text-slate-700">Diastolic BP</span> —
          Resting pressure. Normal: 60-90 mmHg
        </div>
        <div>
          <span className="font-semibold text-slate-700">Temperature</span> —
          Body temp in °C. Normal: 36.0-38.0°C
        </div>
        <div>
          <span className="font-semibold text-slate-700">SpO₂</span> — Oxygen
          saturation %. Normal: ≥95%
        </div>
        <div>
          <span className="font-semibold text-slate-700">Resp. Rate</span> —
          Breaths per minute. Normal: 12-20/min
        </div>
        <div>
          <span className="font-semibold text-slate-700">Pain</span> —
          Self-reported scale 0-10. 0 = none, 10 = worst
        </div>
        <div className="sm:col-span-2">
          <span className="font-semibold text-slate-700">Chief Complaint</span>{" "}
          — Primary reason for ER visit (e.g. chest pain, shortness of breath)
        </div>
      </div>
      <p className="mt-2 text-[10px] text-slate-400">
        Indicators: <span className="text-green-600 font-semibold">Green</span>{" "}
        = normal &nbsp;•&nbsp;{" "}
        <span className="text-amber-600 font-semibold">Amber</span> = abnormal
        &nbsp;•&nbsp; <span className="text-red-600 font-semibold">Red</span> =
        critical
      </p>
    </div>
  );
}
