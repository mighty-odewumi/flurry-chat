import { getAuth, sendEmailVerification } from "firebase/auth";

// Functional React component
export default function SendEmailVerification() {

  const auth = getAuth();

  // Function that sends email verification to user
  // Imported from firebase package
  sendEmailVerification(auth.currentUser)
    .then(() => {
      console.log("Email sent successfully!");
    })
    .catch((err) => {
      const errorCode = err.Code;
      const errorMsg = err.message;
      console.log("Email not sent!", errorCode, errorMsg);
    });

  return (
    <>
      <p>SendEmailVerification component</p>
    </>
  )
}
