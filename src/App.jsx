// import { useState } from 'react';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth } from "firebase/auth";
import SplashScreen from "./pages/splashScreen";
// import SignUp from './auth/SignUp';
// import SignOut from './auth/SignOut';
// import SignIn from './auth/SignIn';
// import SendEmailVerification from "./auth/SendEmailVerification";
// import GetUserProfile from "./auth/GetUserProfile";


export default function App() {

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDjq7WxIwA57mQNvFkQMc5i_HWzgpgbKK4",
    authDomain: "flurry-chat.firebaseapp.com",
    projectId: "flurry-chat",
    storageBucket: "flurry-chat.appspot.com",
    messagingSenderId: "656015662138",
    appId: "1:656015662138:web:83be04d53de81cf091a903",
    measurementId: "G-B04CX4B4BB"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  // const analytics = getAnalytics(app);

  // eslint-disable-next-line no-unused-vars
  const auth = getAuth(app);

  // const email = "joshuastoneage@gmail.com";
  // const password = "harmon13";

  return (
    <>
      <SplashScreen />
      
    </>
  )
}

