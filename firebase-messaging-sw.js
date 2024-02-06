// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

import { firebaseConfig } from "/src/config";

// import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

// const messaging = getMessaging(firebaseConfig);

// onBackgroundMessage(messaging, ( payload ) => {
//   console.log("[firebase-messaging-sw.js] Received background message", payload);
//   const notificationTitle = "Flurry";
//   const notificationOptions = { 
//     body: "Hello Flurries",
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });


// eslint-disable-next-line no-undef
// firebase.initializeApp(firebaseConfig);

// // eslint-disable-next-line no-undef
// const messaging = firebase.messaging();
