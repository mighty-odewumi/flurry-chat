// profileService.js
import { supabase } from './supabaseClient';
import { db } from './firebaseConfig'; // Firebase configuration file
import { doc, updateDoc } from 'firebase/firestore';

// Uploads the user's profile picture
export async function uploadProfilePicture(userId, file) {
  const { data, error } = await supabase.storage
    .from('avatar')
    .upload(`public/${userId}`, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error('Error uploading avatar:', error.message);
    return null;
  }

  return data.path;
}

// Updates the user’s bio and profile picture URL in Firestore
export async function updateUserProfile(userId, bio, profilePath) {
  const profileUrl = supabase.storage.from('avatar').getPublicUrl(profilePath).data.publicUrl;
  const userRef = doc(db, 'users', userId);

  await updateDoc(userRef, {
    bio: bio,
    profilePicture: profileUrl,
  });
}
