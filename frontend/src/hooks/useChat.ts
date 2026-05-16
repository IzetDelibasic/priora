import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { sendMessage, type ChatMessage } from "../api/chat";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId] = useState<string>(() => uuidv4());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendUserMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMsg: ChatMessage = { role: "user", content };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);
      setError(null);

      try {
        const response = await sendMessage(content, sessionId);
        const assistantMsg: ChatMessage = {
          role: "assistant",
          content: response,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch {
        setError(
          "Failed to communicate with the server. Make sure the backend is running.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId, isLoading],
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendUserMessage, clearChat };
}
