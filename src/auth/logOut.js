import { getAuth, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../config";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const logOut = () => {
  signOut(auth).then(() => {
    console.log('User signed out successfully');
  }).catch((error) => {
    console.error('Error signing out: ', error);
  });
};

export default logOut;
