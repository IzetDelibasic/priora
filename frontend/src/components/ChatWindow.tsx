import { useEffect, useRef, useState } from "react";
import { useChat } from "../hooks/useChat";
import { Message } from "./Message";
import styles from "./ChatWindow.module.css";

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
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Priora AI Agent</h1>
        <button
          className={styles.clearBtn}
          onClick={clearChat}
          title="Clear conversation"
        >
          New conversation
        </button>
      </div>

      <div className={styles.messages}>
        {messages.length === 0 && (
          <p className={styles.placeholder}>
            Start a conversation — ask me anything!
          </p>
        )}
        {messages.map((msg, i) => (
          <Message key={i} message={msg} />
        ))}

        {isLoading && (
          <div className={styles.loadingWrapper}>
            <div className={styles.loadingDots}>
              <span />
              <span />
              <span />
            </div>
          </div>
        )}

        {error && <p className={styles.error}>{error}</p>}

        <div ref={bottomRef} />
      </div>

      <div className={styles.inputRow}>
        <textarea
          className={styles.input}
          rows={2}
          placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <button
          className={styles.sendBtn}
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}
