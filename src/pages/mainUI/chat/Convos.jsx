import { useState, useEffect } from 'react';
import { collection, query, where, getFirestore, getDocs, orderBy, limit } from "firebase/firestore";
import { Link, } from "react-router-dom";

export default function ConversationsList({ userId }) {
  const [conversations, setConversations] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [lastMessages, setLastMessages] = useState({});

  useEffect(() => {
    const fetchConversations = async () => {
      const db = getFirestore();
      const conversationsRef = collection(db, 'conversations');
      const queryConstraints = [where('participants', 'array-contains', userId)];
      const conversationsQuery = query(conversationsRef, ...queryConstraints);
      const conversationsSnapshot = await getDocs(conversationsQuery);
      const conversationsData = conversationsSnapshot.docs.map((doc) => doc.data());
      setConversations(conversationsData);
    };
    fetchConversations();
  }, [userId]);

  useEffect(() => {
    const fetchUnreadCounts = async () => {
      const db = getFirestore();
      const conversationsRef = collection(db, 'conversations');
      const queryConstraints = [where('participants', 'array-contains', userId)];
      const conversationsQuery = query(conversationsRef, ...queryConstraints);
      const conversationsSnapshot = await getDocs(conversationsQuery);
      const unreadCountsData = conversationsSnapshot.docs.reduce((acc, doc) => {
        const conversationId = doc.id;
        const unreadCount = doc.data().unreadMessageCount;
        acc[conversationId] = unreadCount;
        return acc;
      }, {});
      console.log(unreadCountsData);
      setUnreadCounts(unreadCountsData);
    };
    fetchUnreadCounts();
  }, [userId]);

  useEffect(() => {
    const fetchLastMessages = () => {
      const db = getFirestore();
      const conversationsRef = collection(db, 'conversations');
      const queryConstraints = [where('participants', 'array-contains', userId)];
      const conversationsQuery = query(conversationsRef, ...queryConstraints);
      const conversationsSnapshot = getDocs(conversationsQuery);
  
      conversationsSnapshot.then((snapshot) => {
        const lastMessagesData = snapshot.docs.reduce((acc, doc) => {
          const conversationId = doc.id;
          const lastMessageRef = collection(db, `conversations/${conversationId}/messages`);
          const lastMessageQuery = query(lastMessageRef, orderBy('timestamp', 'desc'), limit(1));
          const lastMessageSnapshot = getDocs(lastMessageQuery);
  
          lastMessageSnapshot.then((snapshot) => {
            const lastMessage = snapshot.docs[0];
            acc[conversationId] = {
              snippet: lastMessage.data().text,
              timestamp: lastMessage.data().timestamp,
            };
          });
  
          return acc;
        }, {});
        console.log(lastMessagesData);
        setLastMessages(lastMessagesData);
      });
    };
    fetchLastMessages();
  }, [userId]);

  return (
    <div>
      {conversations.map((conversation, index) => (
        <Link
          to={`/chat?senderId=${userId}&recipientId=${conversation.uid}`}
          key={index}
        >
          <div>
            <div>
              <img src={conversation.avatar} alt="user avatar" />
            </div>
            <div>
              <div>
                <span>{conversation.name}</span>
                <span>{lastMessages[conversation.id]?.snippet}</span>
              </div>
              <div>
                <span>{lastMessages[conversation.id]?.timestamp}</span>
                {unreadCounts[conversation.id] > 0 && (
                  <span className="badge">{unreadCounts[conversation.id]}</span>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
