import { getAuth, onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, getFirestore, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Form } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components
export async function action({request}) {
  const formData = await request.formData();
  const message = formData.get("message");
  console.log("Message from action function", message);

  // Save message to Firestore after obtaining input from the user.
  try {
    const db = getFirestore();
    const messageRef = collection(db, "messages");
    await addDoc(messageRef, {
      text: message,
      timeStamp: new Date(),
    });
    console.log("Message saved to Firestore successfully!");
    return { success: true };
  } catch (error) {
    console.log("An error occurred while saving message", error);
    return { success: false, error: error.message };
  }
}

export default function DirectChat() {

  const [messages, setMessages] = useState([]);
  const db = getFirestore();
  const auth = getAuth();

  // Retrieves data from Firestore
  async function syncData() {
    try {
      const messagesRef = collection(db, "messages");
      console.log(messagesRef);
      onSnapshot(messagesRef, snapshot => {
        const messageData = [];
        // const messages = snapshot.docs.map(doc => doc.data());
        snapshot.forEach((doc) => {
          messageData.push({ id: doc.id, ...doc.data() });
        });
        console.log("Messages from Firestore", messageData);
        setMessages(messageData);
      });
    } catch (error) {
      console.log("Error fetching messages", error);
    }
  }

  useEffect(() => {
    const observer = onAuthStateChanged(auth, user => {
      if (user) {      
        syncData();
      }
    });
    return () => observer();
  }, []);

  const fireMsg = messages.map((msg) => (
    <>
      <ul 
        className=""
        key={msg.id}
      >
        <li className="">{msg.text}</li>
      </ul>
    </>
  ));

  return (
    <>
      <h1>Messages on cloud!</h1>
      {fireMsg}
      <br />

      <Form method="post">
        <input 
          type="text" 
          name="message" 
          id="message" 
          className="ring-2"
        />

        <button>
          Send Message
        </button>
      </Form>
    </>
  )
}
