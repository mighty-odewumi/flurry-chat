import { useEffect } from 'react';
import { 
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider,
  useNavigate,
  redirect
} from "react-router-dom";


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged } from "firebase/auth";


// Import auth components
// import SendEmailVerification from "./auth/SendEmailVerification";
// import GetUserProfile from "./auth/GetUserProfile";

// Import pages
import SplashScreen, { loader as splashLoader } from "./pages/SplashScreen";
import SignInPage, { action as signInAction, loader as signInLoginLoader } from "./pages/authPages/SignInPage";

import SignUpPage, { 
  // action as signUpAction, 
  // loader as signUpLoginLoader 
} from "./pages/authPages/SignUpPage";
import { requireAuth } from "./auth/requireAuth";
import SignOut from "./auth/SignOut";

// console.log(localStorage.clear());

export default function App() {

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  };


  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  // const analytics = getAnalytics(app);


  // eslint-disable-next-line no-unused-vars, react-refresh/only-export-components
  const auth = getAuth(app);

  // const navigate = useNavigate();

  useEffect(() => {
    const observer = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        localStorage.setItem("loggedIn", true);
        return redirect("/chats");
      } else {
        localStorage.removeItem("loggedIn");
      }
    });

    return () => observer();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        // loader={signUpLoginLoader}
        // action={signUpAction}
      />

      <Route 
        path="/chats"
        element={
          <>
            <h1>Chat component</h1>
            {/* <SignOut />   */}
          </>
        }
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

