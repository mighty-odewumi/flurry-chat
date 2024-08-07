/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { collection, query, where, getFirestore, getDocs, orderBy, limit,} from "firebase/firestore";
import { Form, Link } from "react-router-dom";
import NewUsers from "./NewUsers";
import profile from "../../../assets/flurry-assets/profile.png";
import search from "../../../assets/flurry-assets/search.png";
import { useAuth } from "../../../auth/AuthContext";


/* export default function ConversationsList() {
  const [previousConversations, setPreviousConversations] = useState([]);

  const { user } = useAuth();
  console.log(user);

  async function getPreviousUsersByIds(userIds) {
    try { 
      const db = getFirestore();
      const usersRef = collection(db, "users");

      // Create a query to find documents where the uid field is in the userIds array
      const querySnapshot = await getDocs(query(usersRef, where("uid", "in", userIds)));

      // Extract user data from query results
      const users = querySnapshot.docs.map(doc => doc.data());
      console.log("Users:", users);
      return users;
    } catch (error) {
      console.error("An error occurred while fetching users:", error);
      return [];
    }
  }

  async function fetchConversationsId() {
    try {
      const db = getFirestore();
      const conversationsRef = collection(db, "conversations");
      const conversationsQuery = await getDocs(query(conversationsRef, 
        where("participants", "array-contains", user?.uid)
      ));
      const prevConvoUsers = [];
      
      conversationsQuery.forEach(doc => {
        const data = doc.data();
        console.log(data);
        const otherParticipantId = data.participants.find(id => id !== user?.uid);
        if (otherParticipantId && !prevConvoUsers.includes(otherParticipantId)) {
          prevConvoUsers.push(otherParticipantId);
        }
      });
      console.log(prevConvoUsers);
      return prevConvoUsers; 
    } catch (error) {
        console.error("Error fetching previous users:", error);
    }
  }

  async function fetchPrevUsers() {
    const userIds = await fetchConversationsId();
    const previousConvos = await getPreviousUsersByIds(userIds);
    console.log(previousConvos);
    setPreviousConversations(previousConvos);
  }

  useEffect(() => {

    fetchPrevUsers();
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]); 


  return (
    <div className="m-4">
      <div className="flex justify-between items-center">
        <h1 className="font-bold font-inter text-[24px]">flurry</h1>
        <Link to="/profile"><img src={profile} alt="user profile" /></Link>
      </div>

      <Form method="get" className="p-1 mt-2 mb-4 border-primarygray border rounded-full flex items-center ">
        <button className="mr-2 ml-2">
          <img 
            src={search} 
            alt="search icon" 
          />
        </button>
        <input 
          type="text"
          placeholder="Search here..."
          className="focus:outline-0"
        />
      </Form>

      <NewUsers />

      <h2 className="my-4 font-bold font-inter text-sm">Previous Chats</h2>
      <ul className="m ax-w-lg mx-auto ">
        {previousConversations?.map((conversation, index) => {

          const username = conversation.username;
          const nameArray = username.split("");
          const userImg = (nameArray[0] + nameArray[1]).toUpperCase();

          return (
            <Link 
              to={`/chat?senderId=${user?.uid}&recipientId=${conversation.uid}&recipientName=${conversation.username}`}
              className="flex items-center justify-between mb-4 hover:bg-gray-100 transition-all p-2"
              key={index}
            >
                
                <div className="flex items-center flex-shrink-0 mr-4">
                    <span className="ring-2 ring-secondaryblue rounded-full px-3 py-2 text-2xl font-bold "
                    >
                      {userImg}
                    </span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between ">
                    <div className="font-semibold text-lg">{conversation.username}</div>
                    
                    <div className="text-gray-500 text-sm">20 April</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600 text-sm mt-1">My message</p>
                    <div className="flex items-center">
                      <span className="text-white rounded-full bg-secondaryblue px-2 py-1 text-xs bg-opacity-100">2</span>
                    </div>
                  </div>
                </div>
            </Link>
        )})}
      </ul>
    </div>
  );
}
*/


export default function ConversationsList() {
  const [previousConversations, setPreviousConversations] = useState(null);

  const { user } = useAuth();

  async function getPreviousUsersByIds(userIds) {
    try { 
      const db = getFirestore();
      const usersRef = collection(db, "users");

      // Create a query to find documents where the uid field is in the userIds array
      const querySnapshot = await getDocs(query(usersRef, where("uid", "in", userIds)));

      // Extract user data from query results
      const users = querySnapshot.docs.map(doc => doc.data());
      console.log("Users:", users);
      return users;
    } catch (error) {
      console.error("An error occurred while fetching users:", error);
      return [];
    }
  }


  async function fetchConversationsId() {
    try {
      const db = getFirestore();
      const conversationsRef = collection(db, "conversations");
      const conversationsQuery = await getDocs(
        query(
          conversationsRef,
          where("participants", "array-contains", user?.uid),
          orderBy("lastMessageTimestamp", "desc") // Order by the timestamp field in descending order
        )
      );
      const prevConvoData = [];
  
      conversationsQuery.forEach((doc) => {
        const data = doc.data();
        const otherParticipantId = data.participants.find(
          (id) => id !== user?.uid
        );
        if (otherParticipantId) {
          prevConvoData.push({
            conversationId: doc.id, // Add the conversation ID
            otherParticipantId,
            lastMessage: data.lastMessage, // Assuming you have a 'lastMessage' field in your conversation document
            lastMessageTimestamp: data.lastMessageTimestamp.toDate(), // Convert Timestamp to JavaScript Date object
          });
        }
      });
      console.log(prevConvoData);
      return prevConvoData;
    } catch (error) {
      console.error("Error fetching previous users:", error);
    }
  }

  async function fetchPrevUsers() {
    const prevConvoData = await fetchConversationsId();
    const previousConvos = await getPreviousUsersByIds(
      prevConvoData.map((data) => data.otherParticipantId)
    );
  
    const previousConversations = previousConvos.map((user, index) => ({
      
      ...user,
      conversationId: prevConvoData[index].conversationId,
      lastMessage: prevConvoData[index].lastMessage,
      lastMessageTimestamp: prevConvoData[index].lastMessageTimestamp,

      // const convoData = prevConvoData.find(convo => convo.userId === user.uid);
      // return {
      // ...user, ...convoData};
    }));
  
    console.log(previousConversations);
    setPreviousConversations(previousConversations);
  }



  useEffect(() => {
    if (user?.uid) {
      fetchPrevUsers();
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]); 

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="font-bold font-inter text-[24px]">flurry</h1>
        <Link to="/profile"><img src={profile} alt="user profile" /></Link>
      </div>

      <Form method="get" className="p-1 mt-2 mb-4 border-primarygray border rounded-full flex items-center ">
        <button className="mr-2 ml-2">
          <img 
            src={search} 
            alt="search icon" 
          />
        </button>
        <input 
          type="text"
          placeholder="Search here..."
          className="focus:outline-0"
        />
      </Form>

      <NewUsers />

      <h2 className="my-4 font-bold font-inter text-sm">Previous Chats</h2>
      <ul className="max-w-lg mx-auto">
        <h1>COnvo</h1>

        {previousConversations?.map((conversation, index) => {
          const username = conversation.username;
          const nameArray = username.split("");
          const userImg = (nameArray[0] + nameArray[1]).toUpperCase();
          const formattedTimestamp = conversation.lastMessageTimestamp?.toLocaleString();

          return (
            <Link
              to={`/chat?conversationId=${conversation.conversationId}&senderId=${user?.uid}&recipientId=${conversation.uid}&recipientName=${conversation.username}`}
              className="flex items-center justify-between mb-4 hover:bg-gray-100 transition-all p-2"
              key={index}
            >
              {/* ... */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-lg">
                    {conversation.username}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {formattedTimestamp}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-gray-600 text-sm mt-1">
                    {conversation.lastMessage}
                  </p>
                  {/* ... */}
                </div>
              </div>
              {/* ... */}
            </Link>
          );
        })}
      </ul>
    </>
  )
}
