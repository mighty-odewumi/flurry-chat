/* eslint-disable react/prop-types */
import { useEffect, useRef, useState,} from "react";
import { useFetcher, useActionData, Link, useNavigate,  } from "react-router-dom";
import { ArrowLeft, MessageSquarePlus, MoreVertical, Send } from 'lucide-react';
import { addDoc, collection, getFirestore, doc, serverTimestamp, updateDoc, setDoc, getDoc, query, orderBy, onSnapshot,} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import Messages from "./Messages";
import { useAuth } from "../../../auth/AuthContext";
import Image from "../../../assets/splash-assets/splash3.jpg";
import ChatAvatar from "./components/avatars/ChatAvatar";
import { groupMessagesByDate } from "../../../utils/groupMessagesByDate";
import ChatLoader from "./ChatLoader";


// Create conversation
async function createConversation(senderId, recipientId, text, senderName, recipientName) {
  try {
    const db = getFirestore();
    const conversationsRef = collection(db, "conversations");
    const newConversationRef = await addDoc(conversationsRef, {
      senderId,
      recipientId,
      participants: [senderId, recipientId],
      users: [
        { id: senderId, name: senderName },
        { id: recipientId, name: recipientName },
      ],
      lastMessageTimestamp: serverTimestamp(),
      lastMessage: "",
    });

    return newConversationRef.id;
  } catch (error) {
    console.log("Unable to create conversation", error);
  }
}

// Sends message
async function sendMessage(senderId, recipientId, text, recipientName, senderName) {
  try {
    const db = getFirestore();
    await createConversation(senderId, recipientId, text, senderName, recipientName);
    const eachMessageId = generateMessageId();
    const conversationId = generateConversationId(senderId, recipientId);
    const messageRef = collection(db, `conversations/${conversationId}/messages`);
    
    // Add message to conversation
    await addDoc(messageRef, {
      eachMessageId,
      text,
      timestamp: serverTimestamp(),
      senderId,
      readBy: [senderId], // Initialize readBy with senderId
    })

    // // Update the conversation's lastMessage and lastMessageTimestamp fields
    const conversationRef = doc(db, `conversations/${conversationId}`);
    const conversationDoc = await getDoc(conversationRef);

    if (conversationDoc.exists()) {
      await updateDoc(conversationRef, {
        lastMessage: text,
        lastMessageTimestamp: serverTimestamp()}, 
        // {merge: true}, 
      );
    } else {
      // Create conversation with the last message and timestamp
      await setDoc(conversationRef, {
        participants: [senderId, recipientId],
        lastMessage: text,
        lastMessageTimestamp: serverTimestamp(),
      });
    }

    console.log("Message sent successfully");
  } catch (error) {
      console.log("Error occurred while sending message!", error);
      throw error;
  }
}

// Generates the conversation ID from user IDs
// eslint-disable-next-line react-refresh/only-export-components
export function generateConversationId(senderId, recipientId) {
  return [senderId, recipientId].sort().join("_");
}

// Generates the message ID randomly
// eslint-disable-next-line react-refresh/only-export-components
export function generateMessageId() {
  return uuidv4();
}

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
export default function DirectChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetcher = useFetcher();
  const status = fetcher.formData?.get("message");
  const { user } = useAuth();

  const navigate = useNavigate();

  const messagesEndRef = useRef(null); // Set a ref to update the UI to the bottom of the chat list.

  const isComplete = fetcher.state === "submitting";
  const searchParams = location.search;
  const queryParams = new URLSearchParams(searchParams);
  const recipientId = queryParams.get("recipientId");
  const recipientName = queryParams.get("recipientName");

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

    if (conversationId) {      
      fetchMessages();
      // markMessagesAsRead(messages, user?.uid); // Mark existing messages as read
    }
   
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, user, recipientId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  
  useEffect(() => {
    scrollToBottom();
  }, [messages])

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <>
      <div className="flex h-screen flex-col">
        <header className="flex items-center p-4 border-b border-gray-200">
          
          <button className="mr-4" onClick={() => navigate("/conversations")}>
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          
          <ChatAvatar src={Image} alt={recipientName} className="mr-3 w-8 h-8" />
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

        <main className="flex-grow overflow-y-auto p-4 flex flex-col mb-14">
        
          {isLoading && <ChatLoader />}

          {messages.length === 0 && 
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 p-6">
              <MessageSquarePlus className="h-12 w-12 text-blue-500" />
              
              <p className="text-gray-600 text-lg font-medium">No Messages Yet</p>

              <p className="text-gray-500">
                Send a message and connect with others!
              </p>
            </div>
          }

          {groupedMessages.map((group) => (
            <div key={group.label}>
              <div className="text-center text-sm text-gray-500 my-2">{group.label}</div>

              {group.messages.map((msg) => (
                <Messages 
                  msg={msg}
                  key={msg.id}
                  user={user}
                  avatar={Image}
                />
              ))}
              
            </div>
          ))}
        
          <div ref={messagesEndRef} />
        </main>

        <footer className="p-4 border-t fixed bottom-0 left-0 right-0 border-gray-200 bg-white">
          <fetcher.Form 
            className="flex items-center bg-gray-100 rounded-full"
            method="POST"        
          >
            <input
              type="text"
              className="flex-grow bg-transparent px-4 py-2 focus:outline-none"
              name="message" 
              id="message" 
              placeholder="Type your message here..."
              value={ isComplete ? "" : status }
            />
            <button 
              className="p-2" 
            >
              <Send className="h-6 w-6 text-blue-500" />
            </button>
          </fetcher.Form>
        </footer>
      </div>

    </>
  );
}
