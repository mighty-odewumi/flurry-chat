/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { collection, query, where, getFirestore, getDocs, orderBy } from "firebase/firestore";
import NewUsers from "./NewUsers";
import Avatar from './components/avatars/Avatar';
import Image from "../../../assets/splash-assets/splash5.jpg";
import { formatConversationDate } from '../../../utils/dateTimeFormatting/formatConversationDate';
import ConversationsHeader from './ConversationsHeader';
import PreviousConversationsLoader from './PreviousConversationsLoader';

const Conversations = ({userId, onSelectConversation}) => {
  const [previousConversations, setPreviousConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchConversations() {
    try {
      setIsLoading(true);
      const db = getFirestore();
      const conversationsRef = collection(db, "conversations");
      const conversationsQuery = await getDocs(query(conversationsRef,
        where("participants", "array-contains", userId),
        orderBy("lastMessageTimestamp", "desc")
      ));
      const prevConvoData = [];

      const userCache = {}; // Cache to store user data to prevent repeated fetches

      for (const doc of conversationsQuery.docs) {
        const data = doc.data();
        const otherParticipantId = data.participants.find(id => id !== userId);

        if (otherParticipantId && !userCache[otherParticipantId]) {
          const userSnapshot = await getDocs(query(collection(db, "users"), where("uid", "==", otherParticipantId)));
          const userData = userSnapshot.docs[0]?.data() || { username: "Unknown" };
          userCache[otherParticipantId] = userData;

          prevConvoData.push({
            uid: otherParticipantId,
            username: userData.username || "Unknown",
            lastMessage: data.lastMessage || "",
            lastMessageTimestamp: data.lastMessageTimestamp ? formatConversationDate(data.lastMessageTimestamp.toDate()) : new Date(),
            avatar: userData.avatar,
          });
        }
      }

      setPreviousConversations(prevConvoData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchConversations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);


  return (
    <div className="md:flex flex-col h-screen bg-white md:w-1/3 hi dden border-r border-gray-300" >

      <ConversationsHeader />
      
      <main className="flex-1 overflow-auto p-4 space-y-6">
        
        <NewUsers userId={userId} onSelectConversation={onSelectConversation} />
       
        <div>
          <h2 className="text-xl font-semibold mb-4">flurs</h2>

          <div className="space-y-4 mx-auto">
            {previousConversations.map((chat) => {
              const { uid, username, lastMessage, lastMessageTimestamp, avatar } = chat;

              return (
                <div 
                  onClick={() => onSelectConversation(chat)}
                  className="flex items-center justify-between mb-4 hover:bg-gray-100 transition-all cursor-pointer"
                  key={uid}
                >
                  <Avatar src={avatar || Image} className="w-14 h-14 mr-2"/>
                  <div className="flex-1">
                    <h3 className="font-semibold">{username}</h3>
                    <p className="text-gray-600 text-sm">{lastMessage}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-gray-400 text-sm">{lastMessageTimestamp}</span>
                    {chat?.unread > 0 && (
                      <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 mt-1">
                        {chat?.unread}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {isLoading && <PreviousConversationsLoader />}

          {(previousConversations.length < 1) && !isLoading &&
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <div className="text-3xl text-gray-600 mb-2">📮</div>
              <p className="text-lg font-semibold text-gray-700">No Conversations Yet!</p>
              <p className="text-gray-700 mt-2">
                Start a conversation with a flurry (another user) now! ⬆ 
              </p>
            </div>
          }
        </div>
      </main>
    </div>
  )
}

export default Conversations;
