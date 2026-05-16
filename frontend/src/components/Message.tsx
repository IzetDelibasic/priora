import type { ChatMessage } from "../api/chat";
import styles from "./Message.module.css";

interface MessageProps {
  message: ChatMessage;
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`${styles.wrapper} ${isUser ? styles.user : styles.assistant}`}>
      <div className={styles.avatar}>{isUser ? "Ti" : "AI"}</div>
      <div className={styles.bubble}>{message.content}</div>
    </div>
  );
}
  );
}
