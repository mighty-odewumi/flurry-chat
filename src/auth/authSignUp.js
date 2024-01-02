import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// Functional React component
// eslint-disable-next-line react/prop-types
export async function authSignUp(email, password) {

  console.log(email, password);

  const auth = getAuth();

  // Function that signs up a user
  // Imported from firebase package
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User created successfully!", user);
  } catch (err) {
      const errorCode = err.code;
      const errorMessage = err.message;
      console.log("An error occurred!!!", errorCode, errorMessage);

      const signUpErrObject = {};
      
      signUpErrObject.errorCode = errorCode;
      signUpErrObject.errMsg = errorMessage;
      console.log(signUpErrObject);
      throw signUpErrObject;
  }
}
