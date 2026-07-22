import { Message } from "@/types/type.res";

export function formatTimestamp(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}
const PREVIEW_MAX_LENGTH = 40;
export function getPreviewText(message: Message | null) {
  if (!message) return "Say hi 👋";
  if (message.text) {
    return message.text.length > PREVIEW_MAX_LENGTH
      ? message.text.slice(0, PREVIEW_MAX_LENGTH) + "…"
      : message.text;
  }
  if (message.image) return "📷 Photo";
  return "";
}