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
  console.log(email, password);

  const errors = {};

  if (typeof email !== "string" || !email.includes("@")) {
    errors.email = "That doesn't look like an email!";
  }

  if (typeof password !== "string" || password.length < 8) {
    errors.password = "Password should not be less than 8 characters!";
  }

  if (Object.keys(errors).length) {
    return errors;
  }

  try {
    const data = await authSignUp(email, password);
    console.log(data);
   
    // console.log(localStorage);

  } catch (err) {
      console.log(err);
      errors.firebaseErr = "An unknown error occurred!", err;

      if (err?.errorCode === "auth/network-request-failed") {
        errors.firebaseErr = "You seem to be offline!";
      }

      if (err?.errorCode === "auth/invalid-credential") {
        errors.firebaseErr = "Invalid password or email supplied!";
      }

      if (err?.errorCode === "auth/email-already-in-use") {
        errors.firebaseErr = "Email already in use!";
      }      

      return errors;
  }
  return null;
}


export default function SignUpPage() {
  const auth = getAuth();

  const data = useLoaderData();
  console.log(data);

  const errors = useActionData();
  const navigation = useNavigation();
  const navigate = useNavigate();
  
  

  useEffect(() => {
    const observer = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        localStorage.setItem("loggedIn", true);
        return navigate("/conversations", { replace: true });
      } else {
          localStorage.removeItem("loggedIn");
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
