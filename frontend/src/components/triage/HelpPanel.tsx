export function HelpPanel() {
  return (
    <div className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-xs text-slate-600 space-y-1.5">
      <p className="font-semibold text-indigo-700 mb-2">Referenca polja</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
        <div>
          <span className="font-semibold text-slate-700">Dob</span> - Dob
          pacijenta u godinama (0-120)
        </div>
        <div>
          <span className="font-semibold text-slate-700">Puls</span> - Otkucaji
          u minuti. Normalno: 60-100 otkucaja/min
        </div>
        <div>
          <span className="font-semibold text-slate-700">Sistolički TA</span> -
          Vršni krvni pritisak. Normalno: 90-140 mmHg
        </div>
        <div>
          <span className="font-semibold text-slate-700">Dijastolički TA</span>{" "}
          - Pritisak u mirovanju. Normalno: 60-90 mmHg
        </div>
        <div>
          <span className="font-semibold text-slate-700">Temperatura</span> -
          Tjelesna temperatura u °C. Normalno: 36.0-38.0°C
        </div>
        <div>
          <span className="font-semibold text-slate-700">SpO₂</span> -
          Saturacija kiseonikom %. Normalno: ≥95%
        </div>
        <div>
          <span className="font-semibold text-slate-700">
            Frekvencija disanja
          </span>{" "}
          - Udisaji u minuti. Normalno: 12-20/min
        </div>
        <div>
          <span className="font-semibold text-slate-700">Bol</span> - Skala
          0-10. 0 = nema bola, 10 = najjači mogući bol
        </div>
        <div className="sm:col-span-2">
          <span className="font-semibold text-slate-700">Glavna pritužba</span>{" "}
          - Primarni razlog dolaska u hitnu (npr. bol u grudima, otežano
          disanje)
        </div>
      </div>
      <p className="mt-2 text-[10px] text-slate-400">
        Indikatori: <span className="text-green-600 font-semibold">Zeleno</span>{" "}
        = normalno &nbsp;•&nbsp;{" "}
        <span className="text-amber-600 font-semibold">Žuto</span> = abnormalno
        &nbsp;•&nbsp; <span className="text-red-600 font-semibold">Crveno</span>{" "}
        = kritično
      </p>
    </div>
  );
}
