/* eslint-disable react-refresh/only-export-components */
import { useEffect } from "react";
import { useActionData, useLoaderData, useNavigate, useNavigation } from "react-router-dom";
import { authSignIn, } from "../../auth/authSignIn";
import Onboarding from "./Onboarding";
import { getAuth, onAuthStateChanged, } from "firebase/auth";


export async function loader({ request }) {
  const url = new URL(request.url)?.searchParams?.get("message");
  const pathname = new URL(request.url).pathname;
  return [url, pathname];
}

// eslint-disable-next-line react-refresh/only-export-components
export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

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
    await authSignIn(email, password);
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

      return errors;
  }

  return null;
}


// SignInPage React component
export default function SignInPage() {
  const errors = useActionData();
  const navigation = useNavigation();
  const data = useLoaderData();
  const queryString = data[0];
  const pathname = data[1];

  const navigate = useNavigate();

  const auth = getAuth();

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
        queryString={queryString}
        pathname={pathname}
      />
    </>
  )
}
