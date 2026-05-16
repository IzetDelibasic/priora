import axios from "axios";

const API_BASE = "http://localhost:8000/api";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  message: string;
  session_id: string;
}

export interface ChatResponse {
  response: string;
  session_id: string;
}

export async function sendMessage(
  message: string,
  sessionId: string,
): Promise<string> {
  const payload: ChatRequest = { message, session_id: sessionId };
  const { data } = await axios.post<ChatResponse>(`${API_BASE}/chat`, payload);
  return data.response;
}

export async function checkHealth(): Promise<boolean> {
  try {
    await axios.get(`${API_BASE}/health`);
    return true;
  } catch {
    return false;
  }
}
