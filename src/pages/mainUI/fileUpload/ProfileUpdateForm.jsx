import { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../../auth/AuthContext";

export default function ProfileUpdateForm() {
  const { user } = useAuth(); // Assuming this gives you access to the user's info
  const [bio, setBio] = useState(user?.bio || "");
  const [image, setImage] = useState(null); // File for the new profile picture
  const [isLoading, setIsLoading] = useState(false);

  // Handles the image input change
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Handle updating the user's profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const db = getFirestore();
    const storage = getStorage();
    const userRef = doc(db, "users", user.uid); // Path to the user in Firestore

    try {
      let imageURL = user?.photoURL; // Default to the existing photo URL

      // Upload image to Firebase Storage if a new image is provided
      if (image) {
        const imageRef = ref(storage, `profile_pictures/${user.uid}`);
        await uploadBytes(imageRef, image);
        imageURL = await getDownloadURL(imageRef); // Get the URL for the new image
      }

      // Update Firestore with the new bio and/or image URL
      await updateDoc(userRef, {
        bio,
        photoURL: imageURL,
      });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4 p-4">
      <label>
        Profile Picture:
        <input type="file" onChange={handleImageChange} className="block mt-2" />
      </label>

      <label>
        Bio:
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="block w-full mt-2 p-2 border rounded-md"
          placeholder="Write something about yourself"
        />
      </label>

      <button
        type="submit"
        disabled={isLoading}
        className={`mt-4 px-4 py-2 text-white rounded ${
          isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {isLoading ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
}
