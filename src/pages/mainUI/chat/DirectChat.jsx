/* eslint-disable react/prop-types */
import { useEffect, useRef, useState,} from "react";
import { useFetcher, Link, useNavigate,  } from "react-router-dom";
import { ArrowLeft, MessageSquarePlus, MoreVertical, Send } from 'lucide-react';
import { collection, getFirestore, query, orderBy, onSnapshot,} from "firebase/firestore";
import Messages from "./Messages";
import { useAuth } from "../../../auth/AuthContext";
import Image from "../../../assets/splash-assets/splash5.jpg";
import ChatAvatar from "./components/avatars/ChatAvatar";
import { groupMessagesByDate } from "../../../utils/dateTimeFormatting/groupMessagesByDate";
import ChatLoader from "./ChatLoader";
import { sendMessage, generateConversationId } from "../../../utils/chatFunctions/directChatFunctions";
import { fetchUserData } from "../../../utils/getProfiles/fetchUserData";


// eslint-disable-next-line react-refresh/only-export-components
export async function action({ request }) {
  const formData = await request.formData();
  const message = formData.get("message");
  const searchParams = location.search;
  const queryParams = new URLSearchParams(searchParams);
  const senderId = queryParams.get("senderId");
  const recipientId = queryParams.get("recipientId");
  const recipientName = queryParams.get("recipientName");
  const senderName = queryParams.get("senderName");
  message && await sendMessage(senderId, recipientId, message, senderName, recipientName);
  return (senderId, recipientId, senderName, recipientName);  
}


// eslint-disable-next-line react/prop-types
export default function DirectChat({ selectedConversation, onBack }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [otherUserData, setOtherUserData] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  const { user } = useAuth();

  const messagesEndRef = useRef(null); // Set a ref to update the UI to the bottom of the chat list.

  const recipientId = selectedConversation?.uid;
  const recipientName = selectedConversation?.username;
  const senderName = user?.username;
  const senderId = user?.uid;

  useEffect(() => {
    // eslint-disable-next-line no-unused-vars

    async function fetchMessages() {
      if (!recipientId || !senderId) return;
      try {
        const db = getFirestore();
        const conversationId = generateConversationId(user?.uid, recipientId);
        const conversationRef = collection(db, `conversations/${conversationId}/messages`);
        const messagesQuery = query(conversationRef, orderBy("timestamp"));

        // Listen for real-time updates 
        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
          const messageData = snapshot.docs.map(doc =>({
              id: doc.id,
              ...doc.data(),
              readBy: doc.data().readBy || [doc.data().senderId], // Initialize readBy with senderId
            }));
            // console.log(messageData);
          setMessages(messageData);
          setIsLoading(false);
        });

        return () => unsubscribe(); // Unsubscribe from real-time updates after unmount

      } catch (error) {
          console.log("Error fetching messages:", error);
          setIsLoading(false);
      } 
    }

    fetchMessages();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [senderId, recipientId, selectedConversation]);

  useEffect(() => {
    fetchUserData(recipientId, setOtherUserData);
  }, [recipientId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    await sendMessage(senderId, recipientId, newMessage.trim(), senderName, recipientName);
    setNewMessage("");
    // fetchMessages();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  
  useEffect(() => {
    scrollToBottom();
  }, [messages])

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex-1 flex h-screen flex-col">
      {selectedConversation ? (
        <>
          <header className="flex items-center p-4 border-b border-gray-200">
            
            <button className="mr-4" onClick={onBack}>
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </button>
            
            <ChatAvatar src={otherUserData?.avatar || Image} alt={recipientName} className="mr-3 w-8 h-8 ring-2" />
            <h1 className="text-lg font-semibold flex-grow">{recipientName}</h1>
            <Link
              to={{
                pathname: '/profile',
                search: `?userId=${recipientId}`
              }}
            >
              <button className="ml-2"  >
                <MoreVertical className="h-6 w-6 text-gray-600" />
              </button>
            </Link>
          </header>

          <main className="flex-grow overflow-y-auto p-4 flex flex-col mb-4">
          
            {isLoading && <ChatLoader />}

            {groupedMessages.map((group) => (
              <div key={group.label}>
                <div className="text-center text-sm text-gray-500 my-2">{group.label}</div>

                {group.messages.map((msg) => (
                  <Messages 
                    msg={msg}
                    key={msg.id}
                    user={user}
                    avatar={otherUserData?.avatar || Image}
                  />
                ))}
                
              </div>
            ))}
          
            <div ref={messagesEndRef} />
          </main>

          <footer className="p-4 border-t border-gray-300 ">
            <div
              className="flex items-center bg-gray-100 rounded-full"
            >
              <input
                type="text"
                className="flex-grow bg-transparent px-4 py-2 focus:outline-none"
                placeholder="Type your message here..."
                value={ newMessage }
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button 
                onClick={handleSendMessage}
                className="p-2" 
              >
                <Send className="h-6 w-6 text-blue-500" />
              </button>
            </div>
          </footer>
        
        </>
      ) : (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 p -6">
            <MessageSquarePlus className="h-12 w-12 text-blue-500" />
            
            <p className="text-gray-600 text-lg font-medium">No Messages Yet</p>

            <p className="text-gray-500">
              Select a conversation to start chatting
            </p>
          </div>
        )
      }
    </div>
  );
}
