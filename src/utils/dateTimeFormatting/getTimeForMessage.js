export function getTimeForMessage(timestamp) {
  const date = new Date(timestamp.seconds * 1000);

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const isAM = hours < 12;

  const formattedHours = String(hours % 12 || 12).padStart(2, 0);

  const formattedMins = String(minutes).padStart(2, 0);

  const period = isAM ? "am" : "pm";

  return `${formattedHours}:${formattedMins} ${period}`;
}
