import { useState } from "react";
import { ChatWindow } from "./components/ChatWindow";
import { TriageForm } from "./components/TriageForm";
import { cn } from "@/lib/utils";
import { Activity, MessageCircle } from "lucide-react";

type Tab = "triage" | "chat";

function App() {
  const [tab, setTab] = useState<Tab>("triage");

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <header className="shrink-0 border-b border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <Activity className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-base font-bold text-slate-900 tracking-tight">
              Priora
            </span>
            <span className="hidden sm:inline text-xs text-slate-400 font-medium border border-slate-200 rounded-full px-2 py-0.5">
              Medical AI
            </span>
          </div>
          <nav className="flex gap-1">
            <TabBtn
              label="Triage"
              icon={<Activity className="h-3.5 w-3.5" />}
              active={tab === "triage"}
              onClick={() => setTab("triage")}
            />
            <TabBtn
              label="AI Chat"
              icon={<MessageCircle className="h-3.5 w-3.5" />}
              active={tab === "chat"}
              onClick={() => setTab("chat")}
            />
          </nav>
        </div>
      </header>
      <div className="flex-1 overflow-auto">
        {tab === "triage" ? <TriageForm /> : <ChatWindow />}
      </div>
    </div>
  );
}

function TabBtn({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all",
        active
          ? "bg-indigo-50 text-indigo-700"
          : "text-slate-500 hover:text-slate-800 hover:bg-slate-100",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

export default App;
