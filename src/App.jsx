// import { useState } from 'react';
import { 
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider,
} from "react-router-dom";


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";


// Import auth components
// import SignUp from './auth/SignUp';
// import SignOut from './auth/SignOut';
// import SignIn from './auth/SignIn';
// import SendEmailVerification from "./auth/SendEmailVerification";
// import GetUserProfile from "./auth/GetUserProfile";

// Import pages
import SplashScreen, { loader as splashLoader } from "./pages/SplashScreen";
import SignInPage from "./pages/authPages/SignInPage";
import AuthRequired from "./pages/authPages/AuthRequired";


export default function App() {

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  };


  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  // const analytics = getAnalytics(app);

  // eslint-disable-next-line no-unused-vars
  const auth = getAuth(app);

  // const email = "joshuastoneage@gmail.com";
  // const password = "harmon13";

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
        
      />

      <Route 
        path=""
        element={<AuthRequired />}
      >
        <Route 
          path="/chats"
        />
      </Route>
      
    </>
  ));
  

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

