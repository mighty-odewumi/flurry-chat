/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { getFirestore, query, collection, where, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function NewUsers({ userId }) {

  const [newUsers, setNewUsers] = useState([]);
  console.log(userId);

  useEffect(() => {
    const fetchNewUsers = async () => {
      try {
        const db = getFirestore();
        const newUsersRef = collection(db, "users");
        // const newUsersQuery = query(newUsersRef, where("users", "array-contains", userId));

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
      <h2>New Users</h2>
      <ul>
        {newUsers.map((appUser) => (
          <li key={appUser.id}>
            <Link to={`/chat/${appUser.id}?senderId=${userId}&recipientId=${appUser.uid}`}>--{appUser.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
