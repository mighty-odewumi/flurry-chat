// ProfileUpdate.js
import { useState } from 'react';
import { uploadProfilePicture, updateUserProfile } from '../../../utils/uploads/uploadFile';
import { useAuth } from '../../../auth/AuthContext';

function ProfileUpdate() {
  const [bio, setBio] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
    let profilePath;
    
    if (file) {
      setIsLoading(true);
      profilePath = await uploadProfilePicture(userId, file);
      await updateUserProfile(userId, bio, profilePath);
      setIsLoading(false);
      alert('Profile updated successfully!');
    } else if (!file && !bio) {
      alert("Nothing to update!");
    } else {
      await updateUserProfile(userId, bio);
      setIsLoading(false);
      alert('Profile updated successfully!');
    }

  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      <label>
        Profile Picture:
        <input type="file" onChange={handleFileChange} accept="image/*" className="block mt-2"/>
      </label>

      <label>
        Bio:
        <textarea value={bio} onChange={handleBioChange}className="block w-full mt-2 p-2 border rounded-md" placeholder="Write something about yourself"/>
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

export default ProfileUpdate;
