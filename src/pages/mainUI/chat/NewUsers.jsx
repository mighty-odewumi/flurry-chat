/* eslint-disable react/prop-types */
import { useState, useEffect, } from "react";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";

// eslint-disable-next-line no-unused-vars
export default function NewUsers() {

  const [newUsers, setNewUsers] = useState([]);
  const { user } = useAuth();
  console.log(user?.uid);

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
    <div>
      <h2 className="font-bold font-inter text-sm mb-3">New Users</h2>
      <ul className="flex overflow-x-scroll gap-1">
        {newUsers.map((appUser) => {

          // Using Users' names to form the image for now.
          // Image uploads will be part of a future update.
          const username = appUser.username;
          const nameArray = username.split("");
          const userImg = (nameArray[0] + nameArray[1]).toUpperCase();

          return (
            <li key={appUser.id}  className="hover:bg-gray-100 transition-all p-2">
              <Link 
                to={`/chat?senderId=${user?.uid}&recipientId=${appUser.uid}&recipientName=${username}`}
               
              >
                <div className="flex flex-col items-center ">
                  {/* <img 
                    src={appUser.avatar} 
                    alt="user avatar" 
                    className="ring-2 rounded-full w-12 h-12"
                  /> */}
                  {/* <div className="ring-2 rounded-[100%] text-center fl ex justify-cent er font-bold w-8 h-8">{userImg}
                  </div> */}
                  <div className="flex items-center">
                    <span className="ring-2 ring-secondaryblue rounded-full px-3 py-2 text-2xl font-bold "
                    >
                      {userImg}
                    </span>
                  </div>
                    
                  <span className="mt-2 font-semibold text-sm">{appUser.username}</span>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  );
}
