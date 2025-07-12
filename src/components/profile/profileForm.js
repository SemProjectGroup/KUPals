"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/authContext";
import Image from "next/image";

export default function UserProfileForm() {
  const { user, profile, loading, updateUserProfile, uploadAvatar } =
    useContext(AuthContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(
    "/placeholder-avatar.png"
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setBio(profile.bio || "");
      setHobbies(
        Array.isArray(profile.hobbies) ? profile.hobbies.join(", ") : ""
      );
      setInstagram(profile.socials?.instagram || "");
      setTwitter(profile.socials?.twitter || "");
      setLinkedin(profile.socials?.linkedin || "");
      setCurrentAvatarUrl(profile.avatarUrl || "/placeholder-avatar.png");
    }
  }, [profile]);

  if (loading) {
    return <p className="text-white text-center">Loading profile...</p>;
  }

  if (!user) {
    return (
      <p className="text-white text-center">
        Please log in to view your profile.
      </p>
    );
  }

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setAvatarFile(e.target.files[0]);

      setCurrentAvatarUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage("");

    try {
      let newAvatarUrl = currentAvatarUrl;
      if (avatarFile) {
        newAvatarUrl = await uploadAvatar(user.uid, avatarFile);
      }

      const updatedProfileData = {
        firstName,
        lastName,
        bio,
        hobbies: hobbies
          .split(",")
          .map((h) => h.trim())
          .filter((h) => h),
        socials: {
          instagram,
          twitter,
          linkedin,
        },
        avatarUrl: newAvatarUrl,
      };

      await updateUserProfile(user.uid, updatedProfileData);
      setMessage("Profile updated successfully!");
      setAvatarFile(null);
      if (currentAvatarUrl.startsWith("blob:")) {
        URL.revokeObjectURL(currentAvatarUrl);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile: " + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-[#252F2D] rounded-2xl shadow-xl p-8 text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">My Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#2ACAA8] shadow-lg">
            <Image
              src={currentAvatarUrl}
              alt="User Avatar"
              layout="fill"
              objectFit="cover"
              onError={(e) => {
                e.target.src = "/placeholder-avatar.png";
              }}
            />
          </div>
          <label
            htmlFor="avatar-upload"
            className="cursor-pointer bg-[#2ACAA8] hover:bg-[#23A891] text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Change Avatar
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          {avatarFile && (
            <p className="text-sm text-gray-400">Selected: {avatarFile.name}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-3 bg-[#354240] border border-[#455553] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] shadow-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-3 bg-[#354240] border border-[#455553] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] shadow-sm"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={user?.email || ""}
            className="w-full p-3 bg-[#354240] border border-[#455553] rounded-lg text-gray-400 cursor-not-allowed focus:outline-none"
            readOnly
            disabled
          />
        </div>

        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows="4"
            placeholder="Tell us about yourself..."
            className="w-full p-3 bg-[#354240] border border-[#455553] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] shadow-sm resize-y"
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="hobbies"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Hobbies (comma-separated)
          </label>
          <input
            type="text"
            id="hobbies"
            value={hobbies}
            onChange={(e) => setHobbies(e.target.value)}
            placeholder="e.g., Hiking, Photography, Gaming"
            className="w-full p-3 bg-[#354240] border border-[#455553] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] shadow-sm"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-300">Social Links</h3>
          <div>
            <label
              htmlFor="instagram"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Instagram URL
            </label>
            <input
              type="url"
              id="instagram"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="https://instagram.com/yourprofile"
              className="w-full p-3 bg-[#354240] border border-[#455553] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] shadow-sm"
            />
          </div>
          <div>
            <label
              htmlFor="twitter"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Twitter URL
            </label>
            <input
              type="url"
              id="twitter"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              placeholder="https://twitter.com/yourprofile"
              className="w-full p-3 bg-[#354240] border border-[#455553] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] shadow-sm"
            />
          </div>
          <div>
            <label
              htmlFor="linkedin"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              LinkedIn URL
            </label>
            <input
              type="url"
              id="linkedin"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
              className="w-full p-3 bg-[#354240] border border-[#455553] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] shadow-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isUpdating}
          className="w-full py-3 px-4 bg-[#2ACAA8] text-white font-semibold rounded-lg hover:bg-[#23A891] focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] focus:ring-offset-2 focus:ring-offset-[#252F2D] transition duration-300 ease-in-out shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdating ? "Saving Profile..." : "Save Profile"}
        </button>

        {message && (
          <p
            className={`text-center text-sm ${
              message.includes("Failed") ? "text-red-400" : "text-green-400"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
