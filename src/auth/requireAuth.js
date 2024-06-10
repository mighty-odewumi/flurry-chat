import { redirect } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useEffect } from "react";

export async function RequireAuth() {
  // const isLoggedIn = localStorage.getItem("loggedIn");
  // console.log(isLoggedIn);
  // const { user } = useAuth();
  
  // // eslint-disable-next-line no-constant-condition
  // useEffect(() => {
  //   if (!user) {
  //     throw redirect("/signin?message=You are not logged in!");
  //   }
  // }, [user, ])
  
  return null;
}
