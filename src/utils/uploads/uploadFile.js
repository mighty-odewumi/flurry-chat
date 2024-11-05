import { supabase } from "../supabase/supabaseClient";
import { updateDoc, getFirestore, collection, getDocs, query, where, } from 'firebase/firestore';

// Uploads the user's profile picture
export async function uploadProfilePicture(userId, file) {
  const { data, error } = await supabase.storage
    .from('avatar')
    .upload(`public/${userId}`, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error('Error uploading avatar:', error);
    return null;
  }

  return data.path;
}

// Updates the user’s bio and profile picture URL in Firestore
export async function updateUserProfile(userId, bio, profilePath) {
  const profileUrl = supabase.storage.from('avatar').getPublicUrl(profilePath).data.publicUrl;
  
  const db = getFirestore();
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("uid", "==", userId));

  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    console.log("No such user");
    return;
  }

  const userDoc = querySnapshot.docs[0].ref;
  await updateDoc(userDoc, {
    bio,
    avatar: profileUrl,
  });
}
