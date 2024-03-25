/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { collection, query, where, getFirestore, getDocs, } from "firebase/firestore";
import { Link } from "react-router-dom";
import NewUsers from "./NewUsers";

export default function ConversationsList({ userId }) {
  const [previousConversations, setPreviousConversations] = useState([]);

  async function getPreviousUsersByIds(userIds) {
    try { 
      const db = getFirestore();
      const usersRef = collection(db, "users");

       // Create a query to find documents where the userId field is in the userIds array
      const querySnapshot = await getDocs(query(usersRef, where("uid", "in", userIds)));

      // Extract user data from query results
      const users = querySnapshot.docs.map(doc => doc.data());
      console.log("Users:", users);
      return users;
    } catch (error) {
      console.error("An error occurred while fetching users:", error);
      return [];
    }
  }

  async function fetchConversationsId() {
    try {
      const db = getFirestore();
      const conversationsRef = collection(db, "conversations");
      const conversationsQuery = await getDocs(query(conversationsRef, 
        where("participants", "array-contains", userId)
      ));
      const prevConvoUsers = [];
      conversationsQuery.forEach(doc => {
        const data = doc.data();
        console.log(data);
        const otherParticipantId = data.participants.find(id => id !== userId);
        if (otherParticipantId && !prevConvoUsers.includes(otherParticipantId)) {
          prevConvoUsers.push(otherParticipantId);
        }
      });
      console.log(prevConvoUsers);
      return prevConvoUsers; 
    } catch (error) {
        console.error("Error fetching previous users:", error);
    }
  }

  async function fetchPrevUsers() {
    const userIds = await fetchConversationsId();
    const previousConvos = await getPreviousUsersByIds(userIds);
    console.log(previousConvos);
    setPreviousConversations(previousConvos);
  }

  useEffect(() => {

    fetchPrevUsers();
    
  }, [userId]); 

  return (
    <div>
      <NewUsers 
        userId={userId}
      />
      <h2>Previous Chats</h2>
      <ul>
        {previousConversations?.map((conversation, index) => (
          <li key={index}>
            <Link to={`/chat?senderId=${userId}&recipientId=${conversation.uid}`}>--Convo #{index} {conversation.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
