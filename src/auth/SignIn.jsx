import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


// Functional React component
// eslint-disable-next-line react/prop-types
export default function SignIn({email, password}) {

  const auth = getAuth();

  // Function that signs in a user
  // Imported from firebase package
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("This user is signed in", user);
    })
    .catch((err) => {
      const errorCode = err.code;
      const errMsg = err.message;
      console.log("An error occurred!", errorCode, errMsg);
    });

  
  return (
    <>
      SignIn was here
    </>
  )
}
