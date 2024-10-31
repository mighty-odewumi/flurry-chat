import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";

// eslint-disable-next-line react/prop-types
export async function authSignUp(email, password, username) {

  const auth = getAuth();

  // Function that signs up a user
  // Imported from firebase package
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password, username);
    const user = userCredential.user;

    // Creates a db entry for signed up users
    const db = getFirestore();
    const usersRef = collection(db, "users");

    // Add user document to the "users" collection with user ID as document ID
    await addDoc(usersRef, {
      uid: user.uid,
      email: email,
      username: username
    });

  } catch (err) {
      const errorCode = err.code;
      const errorMessage = err.message;
      // Removed console logs to deter bad guys a little
      // console.log("An error occurred!!!", errorCode, errorMessage);

      const signUpErrObject = {};
      
      signUpErrObject.errorCode = errorCode;
      signUpErrObject.errMsg = errorMessage;
      // console.log(signUpErrObject);
      throw signUpErrObject;
  }
}
