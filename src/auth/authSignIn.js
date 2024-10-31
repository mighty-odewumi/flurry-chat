import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// eslint-disable-next-line react/prop-types, no-unused-vars
export async function authSignIn(email, password) {
 
  const auth = getAuth();

  // Function that signs in a user
  // Imported from firebase package
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      
      console.log("This user is signed in", user);
      return user;
    })
    .catch((err) => {
      const errorCode = err.code;
      const errMsg = err.message;
      console.log("An error occurred!", errorCode, errMsg);
      const signInErrObject = {};
      
      signInErrObject.errorCode = errorCode;
      signInErrObject.errMsg = errMsg;
      console.log(signInErrObject);
      throw signInErrObject;
    });
}
