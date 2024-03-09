/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { generateConversationId } from "./DirectChat";
import { getFirestore, query, orderBy, onSnapshot, collection } from "firebase/firestore";

export default function MessageList({ conversationId, senderId, recipientId, }) {

  const [messages, setMessages] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    const observer = onAuthStateChanged(auth, user => {

      async function fetchMessages() {
        try {
          const db = getFirestore();
          const conversationId = generateConversationId(senderId, recipientId);
          const conversationRef = collection(db, `conversations/${conversationId}/messages`);
          const messagesQuery = query(conversationRef, orderBy("timestamp"));

          // Listen for real-time updates 
          const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const messageData = snapshot.docs.map(doc =>({
                id: doc.id,
                ...doc.data(),
              }));
            setMessages(messageData);
          });

          return () => unsubscribe(); // Unsubscribe from real-time updates after unmount

        } catch (error) {
            console.log("Error fetching messages:", error);
        }
      }

      if (conversationId) {      
        fetchMessages();
      }
    });
    return () => observer();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [senderId, recipientId]);

  const fireMsg = messages.map((msg) => (
    <ul 
      className=""
      key={msg.id}
    >
      <li className="">{msg.text}</li>
    </ul>
  ));

  return (
    <>
      <h1>Messages on cloud!</h1>
      {fireMsg}
    </>
  )
}
