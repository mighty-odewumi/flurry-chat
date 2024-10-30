/* eslint-disable react/prop-types */
import { addDoc, collection, getFirestore, doc, serverTimestamp, updateDoc, setDoc, getDoc, query, orderBy, onSnapshot,} from "firebase/firestore";
import { useEffect, useRef, useState,} from "react";
import { useFetcher, useActionData, Link, useNavigate,  } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Messages from "./Messages";
import { useAuth } from "../../../auth/AuthContext";
import { ArrowLeft, MoreVertical, Send } from 'lucide-react';
import Image from "../../../assets/splash-assets/splash3.jpg";
import ChatAvatar from "./components/avatars/ChatAvatar";


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

    // console.log("Conversation created", newConversationRef.id);
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
    console.log("Text is", text);
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
export default function DirectChat({ }) {
  const [messages, setMessages] = useState([]);

  const fetcher = useFetcher();
  const status = fetcher.formData?.get("message");
  const { user } = useAuth();

  const navigate = useNavigate();

  const messagesEndRef = useRef(null); // Set a ref to update the UI to the bottom of the chat list.

  const isComplete = fetcher.state === "submitting";
  const actionData = useActionData();
  console.log("Action data", actionData);

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
        });

        return () => unsubscribe(); // Unsubscribe from real-time updates after unmount

      } catch (error) {
          console.log("Error fetching messages:", error);
      }
    }

    if (conversationId) {      
      fetchMessages();
      // markMessagesAsRead(messages, user?.uid); // Mark existing messages as read
    }
   
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, user, recipientId]);
  console.log("Messages", messages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  
  useEffect(() => {
    scrollToBottom();
  }, [messages])


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

        <main className="flex-grow overflow-y-auto p-4 flex flex-col-reverse">
          <div ref={messagesEndRef} />
          
          {messages.slice().reverse().map((msg) => (
            <Messages 
              msg={msg}
              key={msg.id}
              user={user}
              avatar={Image}
            />

          ))}
          <div className="text-center text-sm text-gray-500 my-2">Today</div>

        </main>

        <footer className="p-4 border-t border-gray-200">
          <fetcher.Form 
            className="flex items-center bg-gray-100 rounded-full"
            method="POST"        
          >
            <input
              type="text"
              className="flex-grow bg-transparent px-4 py-2 focus:outline-none"
              // value={inputMessage}
              name="message" 
              id="message" 
              placeholder="Type your message here..."
              value={ isComplete ? "" : status }
              // onChange={(e) => setInputMessage(e.target.value)}
              // onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button 
              className="p-2" 
              // onClick={handleSendMessage}
            >
              <Send className="h-6 w-6 text-blue-500" />
            </button>
          </fetcher.Form>
        </footer>
      </div>

    </>
  );
}
