import { getDateFromTimestamp } from "./getDateFromTimestamp";

export function formatMessageTime(timestamp) {
  const date = getDateFromTimestamp(timestamp);

  let hours = date.getHours();
  const minutes = date.getMinutes();

  const ampm = hours >= 12 ? "pm" : "am";

  // Convert military time to 12hr format
  hours = hours % 12;
  hours = hours ? hours : 12;

  const formattedMinutes = minutes < 10 ? `${minutes}` : minutes;

  return `${hours}:${formattedMinutes} ${ampm}`;
}
