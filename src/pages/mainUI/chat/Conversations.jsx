/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { collection, query, where, getFirestore, getDocs, orderBy } from "firebase/firestore";
import NewUsers from "./NewUsers";
import { Link } from "react-router-dom";
import { Bell, LogOut, Search, Settings, User } from 'lucide-react';
import Avatar from './components/avatars/Avatar';
import Image from "../../../assets/splash-assets/splash5.jpg";
import { formatConversationDate } from '../../../utils/dateTimeFormatting/formatConversationDate';
import logOut from '../../../auth/logOut';
import ConversationsHeader from './ConversationsHeader';

/* We can have a list of predefined avatars and have users choose from them first during signup */

const CurrentUser = ({onClick, className}) => (
  <div
    className={`cursor-pointer`}
    onClick={onClick}
  >
    <User className={`${className}`}/>
  </div>
);

const DropdownMenu = ({ isOpen, onClose, userId }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
      <Link to={`/profile`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
        <Settings className="inline-block mr-2 h-4 w-4" />
        Profile Settings
      </Link>
      <button 
        className="block px-4 py-2 text-sm text-gray-100 hover:bg-gray-400 w-full text-left bg-red-400"
        onClick={logOut}
      >
        <LogOut className="inline-block mr-2 h-4 w-4" />
        Logout
      </button>
    </div>
  )
}

const Conversations = ({userId}) => {
  const [previousConversations, setPreviousConversations] = useState([]);
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // const [isSearchVisible, setIsSearchVisible] = useState(false);


  async function fetchConversations() {
    try {
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
          });
        }
      }

      setPreviousConversations(prevConvoData);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  }

  useEffect(() => {
    fetchConversations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  console.log(previousConversations);
  if (!previousConversations) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col h-screen bg-white" >

      <ConversationsHeader />
      
      <main className="flex-1 overflow-auto p-4 space-y-6">
        {/*<div className="relative ">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search here..."
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>*/}

        <NewUsers />
       
        <div>
          <h2 className="text-xl font-semibold mb-4">flurs</h2>

          {(previousConversations.length < 1) && 
            <div>
              Start a conversation with a flurry (another user) now! ;)
            </div>
          }


          <div className="space-y-4">
            
            {previousConversations.map((chat) => {
              const { uid, username, lastMessage, lastMessageTimestamp } = chat;
              const userImg = username.slice(0, 2).toUpperCase();

              return (
                <Link
                  to={`/chat?senderId=${userId}&recipientId=${uid}&recipientName=${username}`}
                  className="justify-between mb-4 hover:bg-gray-50 transition-all flex items-center space-x-4"
                  key={uid}
                >
                  <Avatar src={Image} className="w-14 h-14"/>
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
                </Link>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Conversations;
