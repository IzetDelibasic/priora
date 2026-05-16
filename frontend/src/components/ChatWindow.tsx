import { useEffect, useRef, useState } from "react";
import { useChat } from "../hooks/useChat";
import { Message } from "./Message";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal, RotateCcw, Bot } from "lucide-react";

export function ChatWindow() {
  const { messages, isLoading, error, sendUserMessage, clearChat } = useChat();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendUserMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
            <Bot className="h-4 w-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Priora AI Assistant
            </p>
            <p className="text-xs text-green-500 font-medium">● Online</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearChat}
          className="gap-1.5 text-slate-500"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          New chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100">
              <Bot className="h-7 w-7 text-indigo-600" />
            </div>
            <p className="text-slate-900 font-semibold">
              How can I help you today?
            </p>
            <p className="text-slate-400 text-sm max-w-xs">
              Ask me anything about symptoms, triage levels, or medical
              guidance.
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <Message key={i} message={msg} />
        ))}

        {isLoading && (
          <div className="flex gap-1.5 pl-10 mt-1">
            <span className="h-2 w-2 rounded-full bg-indigo-300 animate-bounce [animation-delay:0ms]" />
            <span className="h-2 w-2 rounded-full bg-indigo-300 animate-bounce [animation-delay:150ms]" />
            <span className="h-2 w-2 rounded-full bg-indigo-300 animate-bounce [animation-delay:300ms]" />
          </div>
        )}

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-2">
            {error}
          </p>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="px-6 py-4 border-t border-slate-200 bg-white shrink-0">
        <div className="flex gap-2 items-end">
          <Textarea
            rows={2}
            placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="h-10 w-10 shrink-0 rounded-lg"
          >
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-slate-400 mt-1.5">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
