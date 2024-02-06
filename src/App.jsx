import { 
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider,
} from "react-router-dom";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

// Firebase Config
import { firebaseConfig } from "./config";

// import {  requestPopup } from "./utils/messaging_get_token";


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
// import { saveMessagingDeviceToken } from "./firebase/messaging";
// import { getAccessToken } from "./utils/getAccessToken";
// import { notificationCall } from "./utils/notificationCall";

// console.log(localStorage.clear());


export default function App() {

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  // const analytics = getAnalytics(app);

  const auth = getAuth(app);

  const messaging = getMessaging(app);

  const db = getFirestore();

  // saveMessagingDeviceToken();

  // admin.initializeApp({
  //   credential: admin.credential.applicationDefault(),
  // });

  if (location.hostname === "localhost") {
    connectAuthEmulator(auth, "http://localhost:9099");
    connectFirestoreEmulator(db, "localhost", "5180");
  }

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
        path="/chats"
        element={
          <>
            <h1>Chat component</h1>
            <DirectChat />

            {/* <SignOut />   */}
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

