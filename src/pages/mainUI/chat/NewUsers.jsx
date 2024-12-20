/* eslint-disable react/prop-types */
import { useState, useEffect, } from "react";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";
import Avatar from "../chat/components/avatars/Avatar";
import Image from "../../../assets/splash-assets/splash5.jpg";
import NewUsersLoader from "../chat/NewUsersLoader";

// eslint-disable-next-line no-unused-vars
export default function NewUsers({userId, onSelectConversation}) {

  const [newUsers, setNewUsers] = useState([]);
  // const { user } = useAuth();

  useEffect(() => {
    const fetchNewUsers = async () => {
      try {
        const db = getFirestore();
        const newUsersRef = collection(db, "users");

        const unsubscribe = onSnapshot(newUsersRef, (snapshot) => {
          const users = snapshot.docs.map(doc => ({
            id: doc.id, 
            username: doc.username,
            ...doc.data()
          }));
          setNewUsers(users);
        });
        
        return () => unsubscribe();
      } catch (error) {
          console.error("Error fetching previous users:", error);
      }
    };

    fetchNewUsers();
  }, [userId]); 

  return (
    <>
      <div>
        <h2 className="text-xl font-semibold mb-4">flurries</h2>
        {(newUsers.length < 1) && <NewUsersLoader />}
        
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {newUsers.map((newUser) => {
            return (
              // <Link 
              //   to={`/chat?senderId=${user?.uid}&recipientId=${newUser.uid}&recipientName=${username}`}
              //   key={newUser.id}
              // >
              <div 
                onClick={() => onSelectConversation(newUser)}
                className="flex items-center justify-between mb-4 hover:bg-gray-100 transition-all cursor-pointer"
                key={newUser.uid}
              >
                <div 
                  key={newUser.id} 
                  className="flex flex-col items-center"
                >
                  <Avatar src={newUser.avatar || Image} className="w-12 h-12" />
                  <span className="mt-2 text-sm">{userId === newUser.uid ? "My Account (You)" : newUser.username}</span>
                </div>
              </div>
              // </Link>
            )
          })}
        </div>
      </div>
    </>
  );
}
