import { getFirestore, getDocs, collection, where, query } from "firebase/firestore";

export const fetchUserData = async (uid, setUserData) => {
  try {
    const db = getFirestore();
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      setUserData(userDoc.data());
    } else {
      console.log("No user found with such uid");
    }
    
  } catch (error) {
     console.error("Can't fetch user data!", error);
    }  
}