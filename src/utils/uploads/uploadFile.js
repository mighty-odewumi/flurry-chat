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
    alert("Error uploading your profile picture!");
    return null;
  }

  return data.path;
}

// Updates the user’s bio and profile picture URL in Firestore
export async function updateUserProfile(userId, bio, profilePath) {
  const profileUrl = profilePath && supabase.storage.from('avatar').getPublicUrl(profilePath).data.publicUrl;
  
  const db = getFirestore();
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("uid", "==", userId));

  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    console.log("No such user");
    return;
  }

  const userDoc = querySnapshot.docs[0].ref;

  if (bio && !profilePath) {
    await updateDoc(userDoc, {
      bio
    });
  } else if (profilePath && !bio) {
    await updateDoc(userDoc, {
      avatar: profileUrl
    });
  } else {
      await updateDoc(userDoc, {
      bio: bio && bio,
      avatar: profileUrl && profileUrl,
    });
  }
}
