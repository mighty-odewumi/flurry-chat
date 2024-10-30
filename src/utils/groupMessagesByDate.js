export function groupMessagesByDate(messages) {
  const groups = {};  
  const now = new Date();

  messages.forEach(message => {
    if (!message.timestamp || !message.timestamp.seconds) return;
    
    const messageDate = new Date(message?.timestamp?.seconds * 1000);
    const dateKey = messageDate.toDateString();

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }

    groups[dateKey].push(message);
  });

  return Object.keys(groups).map(dateKey => {
    const messageDate = new Date(dateKey);
    const isToday = messageDate.getDate() === now.getDate() && messageDate.getMonth() === now.getMonth() && messageDate.getFullYear() === now.getFullYear();

    const isYesterday = messageDate.getDate() === now.getDate() - 1 && messageDate.getMonth() === now.getMonth() && messageDate.getFullYear() === now.getFullYear();

    let label;
    if (isToday) {
      label = "Today";
    } else if (isYesterday) {
      label = "Yesterday";
    } else {
      label = messageDate.toLocaleDateString(
        "defaut", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    }

    return { label, messages: groups[dateKey] };
  });
}
