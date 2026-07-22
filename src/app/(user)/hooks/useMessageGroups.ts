import { Message } from "@/types/type.res";
import { formatTimestamp } from "../utils/index.utils";

type Row =
  | { type: "label"; id: string; label: string }
  | { type: "message"; id: string; message: Message };

export function withDateLabels(messages: Message[]): Row[] {
  const rows: Row[] = [];
  let lastLabel: string | null = null;

  for (const message of messages) {
    const label = formatTimestamp(message.createdAt);
    if (label !== lastLabel) {
      rows.push({ type: "label", id: `label-${label}-${message._id}`, label });
      lastLabel = label;
    }
    rows.push({ type: "message", id: message._id, message });
  }
  return rows;
}