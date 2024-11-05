// ProfileUpdate.js
import { useState } from 'react';
import { uploadProfilePicture, updateUserProfile } from '../../../utils/uploads/uploadFile';
import { useAuth } from '../../../auth/AuthContext';

function ProfileUpdate() {
  const [bio, setBio] = useState('');
  const [file, setFile] = useState(null);
  const { user } = useAuth();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = user.uid;
    console.log(userId);
    
    if (file) {
      console.log("uploading profile");
      const profilePath = await uploadProfilePicture(userId, file);
      await updateUserProfile(userId, bio, profilePath);
    } else {
      await updateUserProfile(userId, bio);
    }

    alert('Profile updated successfully!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Profile Picture:</label>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      <label>Bio:</label>
      <textarea value={bio} onChange={handleBioChange} placeholder="Add your bio here" />
      <button type="submit">Update Profile</button>
    </form>
  );
}

export default ProfileUpdate;
