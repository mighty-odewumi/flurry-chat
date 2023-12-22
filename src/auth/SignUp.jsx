import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";


// Functional React component
// eslint-disable-next-line react/prop-types
export default function Signup({email, password}) {

  console.log(email, password);

  const auth = getAuth();

  console.log(auth);

  // Function that signs up a user
  // Imported from firebase package
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User created successfully!", user);
    })
    .catch((err) => {
      const errorCode = err.code;
      const errorMessage = err.message;
      console.log("An error occurred!!!", errorCode, errorMessage);
    });

  return (
    <>
      <p>Signup Component</p>
    </>
  )
}
