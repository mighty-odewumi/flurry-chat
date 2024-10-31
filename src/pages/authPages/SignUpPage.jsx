/* eslint-disable react-refresh/only-export-components */
import { useActionData, useLoaderData, useNavigate, useNavigation } from "react-router-dom";
import Onboarding from "./Onboarding";
import { authSignUp } from "../../auth/authSignUp";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";


export async function loader({ request }) {
  return null;
}

export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const username = formData.get("username");

  const errors = {};

  if (typeof email !== "string" || !email.includes("@")) {
    errors.email = "That doesn't look like an email!";
  }

  if (typeof password !== "string" || password.length < 8) {
    errors.password = "Password should not be less than 8 characters!";
  }

  if (typeof password !== "string") {
    errors.username = "Please input a username!";
  }

  if (Object.keys(errors).length) {
    return errors;
  }

  try {
    await authSignUp(email, password, username);
  } catch (err) {
      errors.firebaseErr = "An unknown error occurred!", err;

      if (err?.errorCode === "auth/network-request-failed") {
        errors.firebaseErr = "You seem to be offline!";
      }

      // Moved previous standalone checks to this to prevent malicious use of checking which accounts are available on the platform.
      if ((err?.errorCode === "auth/invalid-credential") || 
      (err?.errorCode === "auth/wrong-password") || 
      (err?.errorCode === "auth/user-not-found")) {
        errors.firebaseErr = "Invalid password or email supplied!";
      } 

      if (err?.errorCode === "auth/email-already-in-use") {
        errors.firebaseErr = "Sorry, account creation failed! Please contact support.";
      }

      return errors;
  }
  return null;
}


export default function SignUpPage() {
  const auth = getAuth();
  // const data = useLoaderData();
  const errors = useActionData();
  const navigation = useNavigation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const observer = onAuthStateChanged(auth, (user) => {
      if (user) {
        return navigate("/conversations", { replace: true });
      } 
    });

    return () => observer();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate])
  
  return (
    <>
      <Onboarding 
        errors={errors}
        navigation={navigation}
      />
    </>
  )
}
