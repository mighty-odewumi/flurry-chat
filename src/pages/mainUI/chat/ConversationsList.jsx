/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, getFirestore } from "firebase/firestore";
import { Link } from "react-router-dom";
import NewUsers from "./NewUsers";

export default function ConversationsList({ userId }) {
  const [conversations, setConversations] = useState([]);
  console.log(userId);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const db = getFirestore();
        const conversationsRef = collection(db, "conversations");
        const conversationsQuery = query(conversationsRef, where("members", "array-contains", userId));

        const unsubscribe = onSnapshot(conversationsQuery, (snapshot) => {
          const convos = snapshot.docs.map(doc => ({
            id: doc.id, 
            ...doc.data()
          }));
          setConversations(convos);
        });
        
        return () => unsubscribe();
      } catch (error) {
          console.error("Error fetching previous users:", error);
      }
    };

    fetchConversations();
  }, [userId]); 

  return (
    <div>
      <NewUsers 
        userId={userId}
      />
      <h2>Previous Chats</h2>
      <ul>
        {conversations.map((conversation) => (
          <li key={conversation.id}>
            <Link to={`/chat/${conversation.id}`}>{conversation.id}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
