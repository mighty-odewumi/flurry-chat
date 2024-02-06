import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { firebaseConfig } from "../config";


const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

getToken(messaging, { vapidKey: "BHPVSORkfXjH-TjXLyt6qBNIwqnD7w-QSdDNGi7Wp5tekJ7CUmJCT0XmdhdDWXSAW6TGrOv-7sKHRPR_fb-mFew" })
  .then((currentToken) => {
    if (currentToken) {
      console.log("Current Token", currentToken);
      return currentToken;
    }
    else {
      console.log("No registration token");
    }
  })
  .catch((err) => {
    console.log("An error occured while fetching token", err);
  });



export function requestPopup() {
  console.log("Requesting permission");
 
  Notification.requestPermission()
    .then((permission) => {
      if (permission === "granted") {
        console.log("Permission was granted!");
      }
      else {
        console.log("Permission denied!");
      }
    })
    .catch((err) => {
      console.log("An unknown error occurred while requesting permission!", err);
    });
}
