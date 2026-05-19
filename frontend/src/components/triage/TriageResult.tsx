import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ESI_CONFIG } from "@/constants/esi";
import { Printer } from "lucide-react";
import type { TriageResponse } from "@/models/triage";

interface TriageResultProps {
  result: TriageResponse;
  onPrint: () => void;
}

export function TriageResult({ result, onPrint }: TriageResultProps) {
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

        <div className="pt-2 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto gap-2"
            onClick={onPrint}
          >
            <Printer className="h-4 w-4" />
            Print / PDF Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
