export function getDateFromTimestamp(timestamp) {
  return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6);
}
