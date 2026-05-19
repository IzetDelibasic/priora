import { Activity, AlertTriangle, CheckCircle, Info } from "lucide-react";
import type { EsiCfg } from "@/models/vitals";

export const ESI_CONFIG: Record<number, EsiCfg> = {
  1: {
    bg: "bg-red-50",
    border: "border-red-300",
    badge: "bg-red-600 text-white",
    text: "text-red-700",
    bar: "bg-red-500",
    icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
    label: "Hitno",
  },
  2: {
    bg: "bg-orange-50",
    border: "border-orange-300",
    badge: "bg-orange-500 text-white",
    text: "text-orange-700",
    bar: "bg-orange-500",
    icon: <AlertTriangle className="h-5 w-5 text-orange-500" />,
    label: "Urgentno",
  },
  3: {
    bg: "bg-yellow-50",
    border: "border-yellow-300",
    badge: "bg-yellow-500 text-white",
    text: "text-yellow-700",
    bar: "bg-yellow-400",
    icon: <Activity className="h-5 w-5 text-yellow-600" />,
    label: "Žurno",
  },
  4: {
    bg: "bg-green-50",
    border: "border-green-300",
    badge: "bg-green-600 text-white",
    text: "text-green-700",
    bar: "bg-green-500",
    icon: <CheckCircle className="h-5 w-5 text-green-600" />,
    label: "Polu-urgentno",
  },
  5: {
    bg: "bg-blue-50",
    border: "border-blue-300",
    badge: "bg-blue-500 text-white",
    text: "text-blue-700",
    bar: "bg-blue-400",
    icon: <Info className="h-5 w-5 text-blue-500" />,
    label: "Nije urgentno",
  },
};
