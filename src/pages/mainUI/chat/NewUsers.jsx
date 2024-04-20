/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function NewUsers({ userId }) {

  const [newUsers, setNewUsers] = useState([]);
  console.log(userId);

  useEffect(() => {
    const fetchNewUsers = async () => {
      try {
        const db = getFirestore();
        const newUsersRef = collection(db, "users");

        const unsubscribe = onSnapshot(newUsersRef, (snapshot) => {
          const users = snapshot.docs.map(doc => ({
            id: doc.id, 
            name: doc.name,
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
    <div>
      <h2 className="font-bold font-inter text-sm mb-3">New Users</h2>
      <ul className="flex overflow-x-scroll gap-4">
        {newUsers.map((appUser) => {
          const username = appUser.name;
          const nameArray = username.split("");
          const userImg = (nameArray[0] + nameArray[1]).toUpperCase();

          return (
            <li key={appUser.id}  className="hover:bg-gray-100 transition-all p-2">
              <Link 
                to={`/chat?senderId=${userId}&recipientId=${appUser.uid}`}
               
              >
                <div className="flex flex-col items-center ">
                  <img 
                    src={appUser.avatar} 
                    alt="user avatar" 
                    className="ring-2 rounded-full w-12 h-12"
                  />
                  {/* <div className="ring-2 rounded-[100%] text-center fl ex justify-cent er font-bold ">{userImg}</div> */}
                  <span className="mt-2">{appUser.name}</span>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  );
}
