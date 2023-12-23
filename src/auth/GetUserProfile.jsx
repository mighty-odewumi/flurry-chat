import { getAuth } from "firebase/auth";


// Functional React component
export default function GetUserProfile() {

  const auth = getAuth();

  const user = auth.currentUser;

  if (user !== null) {
    const displayName = user.displayName;
    const email = user.email;
    const photoURL = user.photoURL;
    const emailVerified = user.emailVerified;
    const uid = user.uid;

    console.log("User info are:", displayName, email, photoURL, emailVerified, uid);
  }

  return (
    <>
      <p>GetUserProfile component</p>
    </>
  )
}
