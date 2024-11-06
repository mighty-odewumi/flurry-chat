import { getMessaging } from "firebase/messaging/sw";
import { firebaseConfig } from "../../config";

const messaging = getMessaging(firebaseConfig);


