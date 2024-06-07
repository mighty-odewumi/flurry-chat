/* eslint-disable react/prop-types */
import { useEffect, useState, useRef, } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { generateConversationId } from "./DirectChat";
import { getFirestore, query, orderBy, onSnapshot, collection, doc, writeBatch, getDoc, } from "firebase/firestore";

export default function MessageList({ senderId, recipientId, }) {

  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
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
        markMessagesAsRead(messages, recipientId); // Mark existing messages as read
      }
    });
    return () => observer();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, senderId, recipientId]);

  useEffect(() => {
  // const scrollToBottom = () => {
      // messagesEndRef.current?.scrollIntoView(false);
    // };

    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight; // Set the messages list to display the bottom everytime the chat is opened or a message in sent from the form.
    }
  }, [messages])
  

  const fireMsg = messages.map((msg) => (
    
    <li className={`${msg.senderId === senderId 
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
