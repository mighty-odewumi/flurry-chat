import { getMessaging } from "firebase/messaging/sw";
import { onBackgroundMessage } from "firebase/messaging/sw";


const messaging = getMessaging();
onBackgroundMessage(messaging, (payload) => {
  console.log("[firebase-messaging-sw.js] Received background message", payload);

  const notificationTitle = "Flurry";
  const notificationOptions = { 
    body: "Hello Flurries",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
