import { useEffect } from "react";
import {
  useNavigate,
} from "react-router-dom";
import { 
  getAuth, 
  signOut, 
  onAuthStateChanged,  
} from "firebase/auth";


//  Functional React component
export default function SignOut() {
  
  const navigate = useNavigate();

  const auth = getAuth();

  // Function that signs out a user
  // Imported from firebase package
  signOut(auth)
    .then(() => {
      console.log("User is signed out!");
    })
    .catch((err) => {
      console.log("An error occurred while signing you out", err.message);
    });

  // Checks for a state in the auth state and updates the UI as laid out
  useEffect(() => {
    const observer = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        // localStorage.setItem("loggedIn", true);
        return navigate("/conversations", { replace: true });
      } else {
          // localStorage.removeItem("loggedIn");
          return navigate("/signin?error=You have been signed out!");
      }
    });

    return () => observer();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }) 

  return (
    <>
      <p>SignOut was here!</p>
    </>
  )
}
