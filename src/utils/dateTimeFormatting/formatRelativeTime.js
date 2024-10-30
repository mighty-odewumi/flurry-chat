export function formatRelativeTime(date) {
  // const date = getDateFromTimestamp(timestamp);
  const now = new Date();
  const diffInMs = now - date;

  const diffInSeconds = Math.floor(diffInMs / 1000);

  const diffInMinutes = Math.floor(diffInSeconds / 60);

  const diffInHours = Math.floor(diffInMinutes / 60);

  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return "Just now";
  } 

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } 

  if (diffInHours < 24) return `${diffInHours}h ago`;

  return `${(diffInDays)}d ago`;
}
