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
    const data = await authSignIn(email, password);
    console.log(data);
  } catch (err) {
      errors.firebaseErr = "An unknown error occurred!", err;

      if (err?.errorCode === "auth/network-request-failed") {
        errors.firebaseErr = "You seem to be offline!";
      }

      if (err?.errorCode === "auth/invalid-credential") {
        errors.firebaseErr = "Invalid password or email supplied!";
      }    

      if (err?.errorCode === "auth/user-not-found") {
        errors.firebaseErr = "No such user found!";
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
        console.log(user);
        // localStorage.setItem("loggedIn", true);
        return navigate("/conversations", { replace: true });
      } 
      // else {
      //     // localStorage.removeItem("loggedIn");
      // }
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
