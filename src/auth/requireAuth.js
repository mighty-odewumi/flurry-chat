import { redirect } from "react-router-dom";

export async function requireAuth() {
  const isLoggedIn = localStorage.getItem("loggedIn");
  console.log(isLoggedIn);
  
  if (!isLoggedIn) {
    throw redirect("/signin?message=You are not logged in!");
  }
  // return redirect("/chats");
}
