/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { collection, query, where, getFirestore, getDocs, } from "firebase/firestore";
import { Form, Link } from "react-router-dom";
import NewUsers from "./NewUsers";
import profile from "../../../assets/flurry-assets/profile.png";
import search from "../../../assets/flurry-assets/search.png";


export default function ConversationsList({ userId }) {
  const [previousConversations, setPreviousConversations] = useState([]);

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
        where("participants", "array-contains", userId)
      ));
      const prevConvoUsers = [];
      
      conversationsQuery.forEach(doc => {
        const data = doc.data();
        console.log(data);
        const otherParticipantId = data.participants.find(id => id !== userId);
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
  }, [userId]); 

  return (
    <div className="m-4">
      <div className="flex justify-between items-center">
        <h1 className="font-bold font-inter text-[24px]">flurry</h1>
        <Link><img src={profile} alt="user profile" /></Link>
      </div>

      <Form method="get" className="p -1 mt-2 mb-4 border-gray-500 border rounded-full flex items-center bg-primarygray ">
        <button className="p-2 pl-3">
          <img 
            src={search} 
            alt="search icon" 
            className="w-4 h-4 "
          />
        </button>
        <input 
          type="text"
          placeholder="Search here..."
          className="focus:outline-0 bg-transparent w-72 "
        />
      </Form>

      <NewUsers 
        userId={userId}
      />

      <h2 className="mt-4 font-bold font-inter text-sm">Previous Chats</h2>
      <ul className="max-w-lg mx-auto ">
        {previousConversations?.map((conversation, index) => {

          // Using Users' names to form the image for now.
          // Image uploads will be part of a future update.
          const username = conversation.name;
          const nameArray = username.split("");
          const userImg = (nameArray[0] + nameArray[1]).toUpperCase();

          return (
            <Link 
              to={`/chat?senderId=${userId}&recipientId=${conversation.uid}`}
              className="flex items-center justify-between mb-4 hover:bg-gray-100 transition-all p-2"
              key={index}
            >
              {/* <div className=""> */}
                {/* <div className="flex-shrink-0 mr-4">
                  <img 
                    src={conversation.avatar} 
                    alt="user avatar" 
                    className="ring-2 rounded-full w-12 h-12"
                  />
                </div> */}

                <div className="flex items-center mr-4">
                  <span className="ring-2 ring-secondaryblue rounded-full px-3 py-2 text-2xl font-bold "
                  >
                    {userImg}
                  </span>
                </div>
                
                {/* <div className="ring-2 rounded-[100%] text-center fl ex justify-cent er font-bold ">{userImg}</div> */}
                <div className="flex-1">
                  <div className="flex items-center justify-between ">
                    <div className="font-semibold text-lg">{conversation.name}</div>
                    
                    <div className="text-gray-500 text-sm">20 April</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600 text-lg ">My message</p>
                    <div className="flex items-center">
                      <span className="text-white rounded-full bg-secondaryblue px-2 py-1 text-xs bg-opacity-100">2</span>
                    </div>
                  </div>
                </div>
              {/* </div> */}
            </Link>
          )
        })}
      </ul>
    </div>
  );
}
