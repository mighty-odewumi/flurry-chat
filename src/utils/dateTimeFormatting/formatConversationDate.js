import { formatRelativeTime } from "./formatRelativeTime";

export function formatConversationDate(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();

  if (date.getDate() === now.getDate() && 
    date.getMonth() === now.getMonth() && 
    date.getFullYear() === now.getFullYear()
  ) {
    return formatRelativeTime(date);
  } 

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  if (
    date.getDate() === yesterday.getDate() && 
    date.getMonth() === yesterday.getMonth() && 
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return "Yesterday";
  }

  // const month = date.toLocaleString("default", { month: "short" });
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}
