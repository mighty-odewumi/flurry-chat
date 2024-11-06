import { 
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider,
  redirect,
} from "react-router-dom";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

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

import DirectChat, { action as chatAction } from "./pages/mainUI/chat/DirectChat";
import Conversations from "./pages/mainUI/chat/Conversations";
import { useAuth } from "./auth/AuthContext";
import Profile from "./pages/mainUI/userProfile/Profile";
import UserProfileUpdate from "./pages/mainUI/profileUpdate/UserProfileUpdate";

// import { saveMessagingDeviceToken } from "./firebase/messaging";
// import { getAccessToken } from "./utils/getAccessToken";
// import { notificationCall } from "./utils/notificationCall";

export default function App() {

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);
  const { user } = useAuth();
  
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
            <Conversations userId={user?.uid}/>
          </>
        }
        loader={async () => {
          if (!user) {
            throw redirect("/signin?message=You are not logged in!");
          }

          return null;
        }}
      />

      <Route 
        path={`/chat`}
        element={
          <>
            <DirectChat />
          </>
        }
        action={chatAction}
        loader={async () => {
          if (!user) {
            throw redirect("/signin?message=You are not logged in!");
          }

          return null;
        }}
      />

      <Route 
        path="/profile"
        element={<Profile />}
        loader={async () => {
          if (!user) {
            throw redirect("/signin?message=You are not logged in!");
          }

          return null;
        }}
      />

      <Route 
        path="/profileUpdate"
        element={<UserProfileUpdate />}
        loader={async () => {
          if (!user) {
            throw redirect("/signin?message=You are not logged in!");
          }

          return null;
        }}
      />
      
    </>
  ));
  

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
