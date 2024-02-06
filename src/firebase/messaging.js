import { messaging, db } from "firebase";
import { onMessage, getToken } from "firebase/messaging";
import { setDoc, doc } from "firebase/firestore";

const VAPID_KEY = "BHPVSORkfXjH-TjXLyt6qBNIwqnD7w-QSdDNGi7Wp5tekJ7CUmJCT0XmdhdDWXSAW6TGrOv-7sKHRPR_fb-mFew";
const FCM_TOKEN_COLLECTION = "fcmTokens";


export async function requestNotificationsPermission(uid) {
  console.log("Requesting notification permissions");

  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    await saveMessagingDeviceToken(uid);
  } else {
    console.log("Unable to get permission");
  }
}

export async function saveMessagingDeviceToken(uid) {
  const fcmToken = await getToken(messaging, { vapidKey: VAPID_KEY });

  if (fcmToken) {
    console.log("FCM Token retrieved", fcmToken);

    const tokenRef = doc(db, FCM_TOKEN_COLLECTION, uid); // Saves token to Firestore.
    await setDoc(tokenRef, { fcmToken }); // Overwrites token if an old one already exists.
  } else {
      requestNotificationsPermission(uid);
  }
}
