import { getAuth, signOut } from "firebase/auth";

//  Functional React component
export default function SignOut() {

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

  return (
    <>
      <p>SignOut was here!</p>
    </>
  )
}
