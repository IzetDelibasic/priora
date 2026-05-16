import type { ChatMessage } from "../api/chat";
import { cn } from "@/lib/utils";

interface MessageProps {
  message: ChatMessage;
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3 mb-3", isUser ? "flex-row-reverse" : "flex-row")}>
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-sm",
          isUser
            ? "bg-indigo-600 text-white"
            : "bg-white border border-slate-200 text-slate-500"
        )}
      >
        {isUser ? "U" : "AI"}
      </div>
      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
          isUser
            ? "bg-indigo-600 text-white rounded-tr-sm"
            : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm"
        )}
      >
        {message.content}
      </div>
    </div>
  );
}
