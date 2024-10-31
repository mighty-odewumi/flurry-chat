import { connectAuthEmulator, getAuth, onAuthStateChanged } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../config";

const AuthContext = createContext();


export default function AuthProvider({children}) {
  
  const [ user, setUser ] = useState(null);
  const [loading, setLoading] = useState(true);
  const app = initializeApp(firebaseConfig);

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    if (location.hostname === "localhost") {
      connectAuthEmulator(auth, "http://localhost:5150");
      connectFirestoreEmulator(db, "localhost", "5180");
    }

    return () => unsubscribe();
  }, [])

  return (
    <AuthContext.Provider value={{user, loading, app}}>
      {children}
    </AuthContext.Provider>
  )

}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
