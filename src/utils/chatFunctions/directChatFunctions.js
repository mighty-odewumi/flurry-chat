import { addDoc, collection, getFirestore, doc, serverTimestamp, updateDoc, setDoc, getDoc, } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";


// Generates the conversation ID from user IDs
// eslint-disable-next-line react-refresh/only-export-components
export function generateConversationId(senderId, recipientId) {
  return [senderId, recipientId].sort().join("_");
}

// Generates the message ID randomly
// eslint-disable-next-line react-refresh/only-export-components
function generateMessageId() {
  return uuidv4();
}


// Create conversation
async function createConversation(senderId, recipientId, senderName, recipientName) {
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
export async function sendMessage(senderId, recipientId, text, recipientName, senderName) {
  try {
    const db = getFirestore();
    await createConversation(senderId, recipientId, senderName, recipientName);
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

  } catch (error) {
      console.log("Error occurred while sending message!", error);
      throw error;
  }
}
