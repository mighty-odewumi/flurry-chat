/* eslint-disable react/prop-types */
import { useEffect, useState, useRef, } from "react";
import { generateConversationId } from "./DirectChat";
import { getFirestore, query, orderBy, onSnapshot, collection, doc, writeBatch, getDoc, } from "firebase/firestore";
import { useAuth } from "../../../auth/AuthContext";

export default function MessageList({ recipientId, }) {

  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const conversationId = generateConversationId(user?.uid, recipientId);

  useEffect(() => {
    // eslint-disable-next-line no-unused-vars

    if (!user) return;
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
          // scrollToBottom();
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
      markMessagesAsRead(messages, user?.uid); // Mark existing messages as read
    }
   
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, user, recipientId]);

  useEffect(() => {

    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight; // Set the messages list to display the bottom everytime the chat is opened or a message in sent from the form.
    }
  }, [messages])
  

  const fireMsg = messages.map((msg) => (
    
    <li className={`${msg.senderId === user?.uid 
      ? "bg-secondaryblue rounded-l-full rounded-tr-full text-white float-right clear-both w-fit" 
      : "bg-primarygray rounded-r-full rounded-tl-full mr-10 float-left clear-both w-fit"
      } my-2 px-6 py-2 `}
      key={msg.id}
    >
      {msg.text}
    </li>
  ));

  return (
    <div className="flex-1 overflow-y-auto p-2 px-3 m x-3" ref={messagesEndRef} >
      <ul className="la st:mb-10" >
        {fireMsg}
      </ul>
    </div>
  )
}
