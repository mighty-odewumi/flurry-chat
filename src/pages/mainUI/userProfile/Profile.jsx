/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate,  } from "react-router-dom";
import { ArrowLeft, Edit2, Camera } from 'lucide-react';
import { useAuth } from "../../../auth/AuthContext";
import ChatAvatar from "../chat/components/avatars/ChatAvatar";
import Image from "../../../assets/splash-assets/splash5.jpg";
import { useLocation } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const Profile = () => {

  const { user } = useAuth();
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  const searchQuery = useQuery();
  const viewedUserId = searchQuery.get('userId'); // Extract viewedUserId from query params

  const isCurrentUser = !viewedUserId || user?.uid === viewedUserId;

  const fetchData = async (uid) => {
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

  useEffect(() => {
    if (isCurrentUser) {
      fetchData(user?.uid);
    } else if (viewedUserId) {
      fetchData(viewedUserId);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCurrentUser, viewedUserId]);

  if (!userData) {
    return <div>Loading...</div>;
  }
  
  return (
    <>
      <div className="flex flex-col h-screen bg-white">
        <header className="flex items-center p-4 border-b border-gray-200">
          <button onClick={() => navigate("/conversations")} className="mr-4">
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold">Profile</h1>
        </header>
        <main className="flex-1 overflow-auto p-4 mb-14">
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <ChatAvatar
                src={userData?.avatar || Image}
                alt="Profile"
                className="w-32 h-32 rounded-full"
              />
              {isCurrentUser && 
                <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full">
                  <Camera className="h-5 w-5" />
                </button>
              }
            </div>
            <h2 className="mt-4 text-2xl font-bold">{userData?.username}</h2>
            <p className="text-gray-600">@{userData?.username}</p>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Bio</h3>
              <p className="text-gray-700">
                {userData?.bio || `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`}
              </p>
            </div>
            {isCurrentUser && (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Email</h3>
                  <p className="text-gray-700">{userData?.email}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Phone</h3>
                  <p className="text-gray-700">+1 (555) 123-4567</p>
                </div>
              </>
            )}
          </div>
        </main>

        {isCurrentUser && (
          <footer className="fixed bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-full flex items-center justify-center">
              <Edit2 className="h-5 w-5 mr-2" />
              Edit Profile
            </button>
          </footer>)
        }
      </div>
    </>
  )
}

export default Profile;
