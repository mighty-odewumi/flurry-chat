import { 
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider,
} from "react-router-dom";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { getAuth, connectAuthEmulator, onAuthStateChanged } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

// Firebase Config
import { firebaseConfig } from "./config";

// import {  requestPopup } from "./utils/messaging_get_token";
import { useEffect, useState } from "react";

// Import auth components
// import SendEmailVerification from "./auth/SendEmailVerification";
// import GetUserProfile from "./auth/GetUserProfile";

// Import pages
import SplashScreen, { 
  loader as splashLoader 
} from "./pages/SplashScreen";

import SignInPage, { 
  action as signInAction, 
  loader as signInLoginLoader 
} from "./pages/authPages/SignInPage";

import SignUpPage, { 
  action as signUpAction, 
  loader as signUpLoginLoader 
} from "./pages/authPages/SignUpPage";

import { requireAuth } from "./auth/requireAuth";
import SignOut from "./auth/SignOut";
import DirectChat, { action as chatAction } from "./pages/mainUI/chat/DirectChat";
import ConversationsList from "./pages/mainUI/chat/ConversationsList";
// import { saveMessagingDeviceToken } from "./firebase/messaging";
// import { getAccessToken } from "./utils/getAccessToken";
// import { notificationCall } from "./utils/notificationCall";

// console.log(localStorage.clear());


export default function App() {

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  // const analytics = getAnalytics(app);


  const messaging = getMessaging(app);

  const db = getFirestore();

  const [userId, setUserId] = useState(null);

  // saveMessagingDeviceToken();

  // admin.initializeApp({
  //   credential: admin.credential.applicationDefault(),
  // });

  // if (location.hostname === "localhost") {
  //   connectAuthEmulator(auth, "http://localhost:9099");
  //   connectFirestoreEmulator(db, "localhost", "5180");
  // }

  useEffect(() => {
    const auth = getAuth(app);
    const observer = onAuthStateChanged(auth, user => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    if (location.hostname === "localhost") {
      connectAuthEmulator(auth, "http://localhost:9099");
      connectFirestoreEmulator(db, "localhost", "5180");
    }

    return () => observer();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const router = createBrowserRouter(createRoutesFromElements(
    <>
      <Route 
        path="/" 
        element={<SplashScreen />} 
        loader={splashLoader}
      />
      <Route 
        path="/signin" 
        element={<SignInPage />} 
        loader={signInLoginLoader}
        action={signInAction}
      />

      <Route 
        path="/signup" 
        element={<SignUpPage />} 
        loader={signUpLoginLoader}
        action={signUpAction}
      />

      <Route
        path="/conversations"
        element={
          <>
            <ConversationsList 
              userId={userId}
            />
            {/* <SignOut /> */}
          </>
        }
        loader={async () => await requireAuth()}
      />

      <Route 
        path={`/chat`}
        element={
          <>
            <h1>Chat component</h1>
            <DirectChat 
              userId={userId}
            />
          </>
        }
        action={chatAction}
        loader={async () => await requireAuth()}
      />
      
    </>
  ));
  

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
