/* eslint-disable react/prop-types */
import { useState, useEffect, } from "react";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";
import Avatar from "../chat/components/Avatar";
import { User } from "lucide-react";

// eslint-disable-next-line no-unused-vars
export default function NewUsers() {

  const [newUsers, setNewUsers] = useState([]);
  const { user } = useAuth();

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
  }, [user?.uid]); 

  return (
    <>
      <div>
        <h2 className="text-xl font-semibold mb-4">flurries</h2>
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {newUsers.map((newUser) => {
            // Using Users' names to form the image for now.
            // Image uploads will be part of a future update.
            const username = newUser.username;
            const nameArray = username.split("");
            const userImg = (nameArray[0] + nameArray[1]).toUpperCase();

            return (
              <Link 
                to={`/chat?senderId=${user?.uid}&recipientId=${newUser.uid}&recipientName=${username}`}
                key={newUser.id}
              >
                <div 
                  key={newUser.id} 
                  className="flex flex-col items-center"
                >
                  <div
                    className={`rounded-full border-2 border- blue-500 overflow-hidden p-2 bg-gray-50`}
                  >
                    <User 
                      userImg={userImg} 
                      className="w-8 h-8" 
                    />
                    {/* {userImg} */}
                  </div>
                  {/* <div className="flex items-center">
                    <span className="ring-2 ring-secondaryblue rounded-full px-3 py-2 text-2xl font-bold "
                    >
                      {userImg}
                    </span> 
                  </div>*/}
                  <span className="mt-2 text-sm">{newUser.username}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  );
}
