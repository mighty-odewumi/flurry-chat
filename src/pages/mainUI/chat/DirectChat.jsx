import { addDoc, collection, getFirestore, serverTimestamp } from "firebase/firestore";
// import { useEffect, useState } from "react";
import { useFetcher, useActionData } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import MessageList from "./MessageList";

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
      timestamp: serverTimestamp()
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
  await sendMessage(senderId, recipientId, message);
  return (senderId, recipientId);  
}

// eslint-disable-next-line react/prop-types
export default function DirectChat({ userId }) {

  const fetcher = useFetcher();
  const status = fetcher.formData?.get("message");

  const isComplete = fetcher.state === "submitting";
  const actionData = useActionData();
  console.log("Action data", actionData);

  const searchParams = location.search;
  const queryParams = new URLSearchParams(searchParams);
  const recipientId = queryParams.get("recipientId");

  return (
    <>
      
      <br />
      <MessageList 
        conversationId={"hello"}
        senderId={userId}
        recipientId={recipientId}
      />
      <br />

      <fetcher.Form method="post">
        <input 
          type="text" 
          name="message" 
          id="message" 
          placeholder="Enter your message"
          value={ isComplete ? "" : status }
          className="ring-2"
        />

        <button>
          Send Message
        </button>
      </fetcher.Form>
    </>
  );
}
