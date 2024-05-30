/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { generateConversationId } from "./DirectChat";
import { getFirestore, query, orderBy, onSnapshot, collection, doc, writeBatch, getDoc, } from "firebase/firestore";

export default function MessageList({ senderId, recipientId, }) {

  const [messages, setMessages] = useState([]);
  const auth = getAuth();
  const conversationId = generateConversationId(senderId, recipientId);

  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    const observer = onAuthStateChanged(auth, user => {

      async function fetchMessages() {
        try {
          const db = getFirestore();
          const conversationRef = collection(db, `conversations/${conversationId}/messages`);
          const messagesQuery = query(conversationRef, orderBy("timestamp"));

          // Listen for real-time updates 
          const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const messageData = snapshot.docs.map(doc =>({
                id: doc.id,
                ...doc.data(),
                readBy: doc.data().readBy || [doc.data().senderId], // Initialize readBy with senderId
              }));
              console.log(messageData);
            setMessages(messageData);
          });

          return () => unsubscribe(); // Unsubscribe from real-time updates after unmount

        } catch (error) {
            console.log("Error fetching messages:", error);
        }
      }

      /* async function markMessagesAsRead(messages, userId) {
        const db = getFirestore();
        const batch = writeBatch(db);
      
        messages.forEach((message) => {
          if (!message.readBy.includes(userId)) {
            const messageRef = doc(db, `conversations/${conversationId}/messages`, message.id);
            batch.update(messageRef, {
              readBy: [...message.readBy, userId],
            });
            
          }
          console.log(message.readBy);
        });
      
        await batch.commit();
      } */

      async function markMessagesAsRead(messages, userId) {
        const db = getFirestore();
        const batch = writeBatch(db);

        for (const message of messages) {
          if (!message.readBy.includes(userId)) {
            const messageRef = doc(db, `conversations/${conversationId}/messages/${message.id}`);
            const messageSnapshot = await getDoc(messageRef);

            if (messageSnapshot.exists()) {
              batch.update(messageRef, {
                readBy: [...message.readBy, userId],
              });
            } else {
              console.error(`Message document with ID ${message.id} does not exist`);
            }
          }
        }

        await batch.commit();
      }

      if (conversationId) {      
        fetchMessages();
        markMessagesAsRead(messages, recipientId); // Mark existing messages as read
      }
    });
    return () => observer();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, senderId, recipientId]);

  const fireMsg = messages.map((msg) => (
    <ul 
      className="last:mb-10"
      key={msg.id}
    >
      <li className={`${msg.senderId === senderId 
        ? "bg-secondaryblue rounded-l-full rounded-tr-full text-white float-right clear-both w-fit" 
        : "bg-gray-400 rounded-r-full rounded-tl-full mr-10 float-left clear-both w-fit"
        } my-2 px-6 py-2 `
      }>
        {msg.text}
      </li>
    </ul>
  ));

  return (
    <div className="m-4 mb- 24 h-max">
      {fireMsg}
    </div>
  )
}
