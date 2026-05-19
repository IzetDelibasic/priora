import { cn } from "@/lib/utils";

interface PainSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const PAIN_LABELS: Record<number, string> = {
  0: "Nema bola",
  2: "Blagi",
  4: "Umjereni",
  6: "Značajni",
  8: "Jaki",
  10: "Najjači",
};

function getPainColor(v: number): string {
  if (v === 0) return "text-slate-400";
  if (v <= 3) return "text-green-600";
  if (v <= 5) return "text-amber-500";
  if (v <= 7) return "text-orange-500";
  return "text-red-600";
}

function getPainBg(v: number): string {
  if (v === 0) return "bg-slate-100 border-slate-200";
  if (v <= 3) return "bg-green-50 border-green-200";
  if (v <= 5) return "bg-amber-50 border-amber-200";
  if (v <= 7) return "bg-orange-50 border-orange-200";
  return "bg-red-50 border-red-200";
}

function getTrackGradient(v: number): string {
  const pct = (v / 10) * 100;
  return `linear-gradient(to right, #22c55e 0%, #eab308 40%, #f97316 65%, #ef4444 100%) 0 0 / ${pct}% 100% no-repeat, #e2e8f0`;
}

export function PainSlider({ value, onChange }: PainSliderProps) {
  const label =
    PAIN_LABELS[value] ??
    (value <= 3
      ? "Blagi"
      : value <= 5
        ? "Umjereni"
        : value <= 7
          ? "Značajni"
          : "Jaki");

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between h-5">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider leading-none">
          Skala bola
        </label>
        <div
          className={cn(
            "flex items-center gap-1.5 rounded border px-2 py-0.5 text-xs font-bold leading-none",
            getPainBg(value),
            getPainColor(value),
          )}
        >
          <span className="text-base font-black">{value}</span>
          <span className="text-[10px] font-semibold">{label}</span>
        </div>
      </div>

      <div className="relative">
        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          style={{ background: getTrackGradient(value) }}
          className="w-full h-2 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-slate-400
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:cursor-grab
            [&::-webkit-slider-thumb:active]:cursor-grabbing
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-slate-400
            [&::-moz-range-thumb]:cursor-grab"
        />
        <div className="flex justify-between mt-1 px-0.5">
          {Array.from({ length: 11 }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onChange(i)}
              className={cn(
                "text-[10px] font-medium leading-none w-4 text-center transition-colors",
                i === value
                  ? getPainColor(value) + " font-bold"
                  : "text-slate-300 hover:text-slate-500",
              )}
            >
              {i}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
