/* eslint-disable react-refresh/only-export-components */
import { useEffect } from "react";
import { redirect, useActionData, useLoaderData, useNavigate, useNavigation } from "react-router-dom";
import { authSignIn } from "../../auth/authSignIn";
import Onboarding from "./Onboarding";
import { getAuth, onAuthStateChanged } from "firebase/auth";


export async function loader({ request }) {
  const url = new URL(request.url).searchParams.get("message");
  // console.log(url);
  return url;
}


// eslint-disable-next-line react-refresh/only-export-components
export async function action({ request }) {
  // console.log(request);
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
    const data = await authSignIn(email, password);
    console.log(data);
    
    console.log(localStorage);
    return redirect("/chats");

  } catch (err) {
      if (err?.errMsg?.includes("invalid-credential")) {
        errors.firebaseErr = "No user with those credentials found!";
      }
      
      if (err?.errMsg) {
        errors.firebaseErr = err?.errMsg;
      }

      return errors;
  }

}


export default function SignInPage() {

  const errors = useActionData();
  const navigation = useNavigation();
  const data = useLoaderData();
  const navigate = useNavigate();

  const auth = getAuth();

  useEffect(() => {
    const observer = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        localStorage.setItem("loggedIn", true);
        return navigate("/chats");
      } else {
        localStorage.removeItem("loggedIn");
      }
    });

    return () => observer();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Onboarding 
        errors={errors}
        navigation={navigation}
        data={data}
      />
    </>
  )
}
