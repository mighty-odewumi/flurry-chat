/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { collection, query, where, getFirestore, getDocs, orderBy } from "firebase/firestore";
import { Form, Link } from "react-router-dom";
import NewUsers from "./NewUsers";
import profile from "../../../assets/flurry-assets/profile.png";
import search from "../../../assets/flurry-assets/search.png";

export default function ConversationsList({ userId }) {
  const [previousConversations, setPreviousConversations] = useState([]);

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
            lastMessageTimestamp: data.lastMessageTimestamp ? data.lastMessageTimestamp.toDate() : new Date(),
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
  }, [userId]);

  return (
    <div className="m-4">
      <div className="flex justify-between items-center">
        <h1 className="font-bold font-inter text-[24px]">flurry</h1>
        <Link to="/profile"><img src={profile} alt="user profile" /></Link>
      </div>

      <Form method="get" className="p-1 mt-2 mb-4 border-gray-500 border rounded-full flex items-center">
        <button className="mr-2 ml-2">
          <img src={search} alt="search icon" />
        </button>
        <input type="text" placeholder="Search here..." className="focus:outline-0" />
      </Form>

      <NewUsers userId={userId} />

      <h2 className="my-4 font-bold font-inter text-sm">Previous Chats</h2>
      <ul className="max-w-lg mx-auto">
        {previousConversations.map((conversation, index) => {
          const { uid, username, lastMessage, lastMessageTimestamp } = conversation;
          const userImg = username.slice(0, 2).toUpperCase();
          return (
            <Link
              to={`/chat?senderId=${userId}&recipientId=${uid}&recipientName=${username}`}
              className="flex items-center justify-between mb-4 hover:bg-gray-100 transition-all p-2"
              key={index}
            >
              <div className="flex items-center flex-shrink-0 mr-4">
                <span className="ring-2 ring-secondaryblue rounded-full px-3 py-2 text-2xl font-bold">
                  {userImg}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-lg">{username}</div>
                  <div className="text-gray-500 text-sm">{lastMessageTimestamp.toLocaleDateString()}</div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600 text-sm mt-1">{lastMessage}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}
