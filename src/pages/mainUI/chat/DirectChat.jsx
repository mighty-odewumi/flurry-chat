import { addDoc, collection, getFirestore, serverTimestamp } from "firebase/firestore";
import { useEffect, useRef, } from "react";
import { useFetcher, useActionData, Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import MessageList from "./MessageList";
import send from "../../../assets/flurry-assets/sendIcon2.png";
import back from "../../../assets/flurry-assets/back.png";
import profile from "../../../assets/flurry-assets/profile.png";
import { useAuth } from "../../../auth/AuthContext";


// Create conversation
async function createConversation(senderId, recipientId) {
  try {
    const db = getFirestore();
    const conversationsRef = collection(db, "conversations");
    await addDoc(conversationsRef, {
      senderId,
      recipientId,
      participants: [senderId, recipientId],
      lastTimestamp: serverTimestamp(),
    });
  } catch (error) {
    console.log("Unable to create conversation", error);
  }
}

// Sends message
async function sendMessage(senderId, recipientId, text) {
  try {
    const db = getFirestore();
    await createConversation(senderId, recipientId);
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
    }); 

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
  message && await sendMessage(senderId, recipientId, message);
  return (senderId, recipientId);  
}

// eslint-disable-next-line react/prop-types
export default function DirectChat() {

  const fetcher = useFetcher();
  const status = fetcher.formData?.get("message");
  const { user } = useAuth();

  const messagesEndRef = useRef(null); // Set a ref to update the UI to the bottom of the chat list.

  const isComplete = fetcher.state === "submitting";
  const actionData = useActionData();
  console.log("Action data", actionData);

  const searchParams = location.search;
  const queryParams = new URLSearchParams(searchParams);
  const recipientId = queryParams.get("recipientId");
  const recipientName = queryParams.get("recipientName");

  useEffect(() => {
    if (messagesEndRef.current) {
      // if (fetcher.state === "submitting") {
      //   const lastMessageElement = messagesEndRef.current.lastChild;
      //   lastMesssageElement.scrollIntoView();
      // } else {
      //   messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
      // }
      messagesEndRef.current.focus(); // Set the bottom of the messages list to the position to be viewed infinitely unless scrolled up.
    }
  }, [])


  return (
    <div className="flex h-screen flex-col">

      <div className="flex items-center justify-between m-4">
        <Link to="/conversations">
          <img 
            src={back} 
            alt="back button" 
          />
        </Link>

        <div className="flex items-center ">
          <Link to="/profile" className="flex justify-center items-center" >
            <div className="flex-shrink-0 mr-3">
              <img 
                src={profile} 
                alt="user avatar" 
                className="ring-2 rounded-full w-10 h-10 p-2"
              />
            </div>

            <p className="font-medium">{recipientName}</p>
          </Link>
          
        </div>
        
        <div className=""></div>
      </div>
      
      <div className="border-b-2"></div>
      {/* <br /> */}
      <MessageList 
        recipientId={recipientId}
        messagesEndRef={messagesEndRef}
      />

      <fetcher.Form method="post" className="flex items-center rounded-full bg-primarygray p-5 py-3 mt-5 bottom-0 inset-x-0 sticky z-[100000] w-full shadow-md">
        <input 
          type="text" 
          name="message" 
          id="message" 
          placeholder="Type your message here..."
          value={ isComplete ? "" : status }
          className="bg-transparent outline-0 mr-auto w-full "
        />

        <button >
          <img 
            src={send} 
            alt="Send button" 
            className="h-6 mx-3 hover:h-7 hover:cursor-pointer transition-all " 
          />
        </button>
      </fetcher.Form>
    </div>
  );
}
