"use client";

import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { AuthContext } from "@/context/authContext";

function createAvatarPlaceholder(name) {
  const initial = name ? name.charAt(0).toUpperCase() : "U";
  const bgColor = "#3CE6BD";
  const textColor = "#FFFFFF";
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="${bgColor}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="50" font-family="Arial, sans-serif" fill="${textColor}">${initial}</text></svg>`;
  const encodedSvg = encodeURIComponent(svgContent);
  return `data:image/svg+xml,${encodedSvg}`;
}

export default function SettingsPage() {
  const {
    user,
    profile,
    loading: authLoading,
    updateUserProfile,
    uploadAvatar,
  } = useContext(AuthContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [profileSaveStatus, setProfileSaveStatus] = useState("");
  const [passwordChangeStatus, setPasswordChangeStatus] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  const firebaseConfig = JSON.parse(
    typeof __firebase_config !== "undefined" ? __firebase_config : "{}"
  );
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setBio(profile.bio || "");
      setDepartment(profile.department || "");
      setSemester(profile.semester || "");
      setHobbies(profile.hobbies ? profile.hobbies.join(", ") : "");
      setLinkedin(profile.socials?.linkedin || "");
      setGithub(profile.socials?.github || "");
    }
  }, [profile]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaveStatus("saving");
    try {
      const updatedProfileData = {
        firstName,
        lastName,
        bio,
        department,
        semester,
        hobbies: hobbies
          .split(",")
          .map((h) => h.trim())
          .filter((h) => h),
        socials: {
          linkedin,
          github,
        },
      };

      if (avatarFile && user) {
        const avatarUrl = await uploadAvatar(user.uid, avatarFile);
        updatedProfileData.avatarUrl = avatarUrl;
      }

      await updateUserProfile(user.uid, updatedProfileData);
      setProfileSaveStatus("success");
      setAvatarFile(null);
    } catch (error) {
      console.error("Error saving profile:", error);
      setProfileSaveStatus("error");
    } finally {
      setTimeout(() => setProfileSaveStatus(""), 3000);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordChangeStatus("changing");

    if (newPassword !== confirmNewPassword) {
      setPasswordChangeStatus("error");
      alert("New passwords do not match.");
      setTimeout(() => setPasswordChangeStatus(""), 3000);
      return;
    }
    if (!currentPassword || !newPassword) {
      setPasswordChangeStatus("error");
      alert("Please fill in both current and new passwords.");
      setTimeout(() => setPasswordChangeStatus(""), 3000);
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setPasswordChangeStatus("success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordChangeStatus("error");
      if (error.code === "auth/wrong-password") {
        alert("Incorrect current password.");
      } else if (error.code === "auth/weak-password") {
        alert("Password is too weak. Please choose a stronger password.");
      } else {
        alert("Failed to change password. Please try again.");
      }
    } finally {
      setTimeout(() => setPasswordChangeStatus(""), 3000);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center text-white">
        <p>Loading settings...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex flex-col items-center justify-center text-white p-4">
        <p className="text-xl mb-4">
          You need to be logged in to view settings.
        </p>
        <Link href="/create-account">
          <button className="py-2 px-6 bg-[#2ACAA8] text-white rounded-md hover:bg-[#23A891] transition duration-300 ease-in-out">
            Sign Up / Login
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] py-8 flex items-center justify-center font-sans">
      <div className="w-full max-w-4xl bg-[#252F2D] rounded-2xl shadow-xl flex flex-col p-8 md:p-12">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          User Settings
        </h1>

        <section className="mb-10 p-6 bg-[#252F2D]/70 rounded-xl border border-[#3A3A4D]/50 shadow-md">
          <h2 className="text-2xl font-semibold text-[#2ACAA8] mb-6">
            Profile Information
          </h2>
          <form onSubmit={handleProfileSave} className="space-y-6">
            <div className="flex flex-col items-center mb-6">
              <img
                src={
                  profile?.avatarUrl ||
                  createAvatarPlaceholder(profile?.firstName)
                }
                alt="User Avatar"
                className="w-24 h-24 rounded-full object-cover border-2 border-[#2ACAA8] mb-4"
              />
              <label
                htmlFor="avatarUpload"
                className="cursor-pointer px-4 py-2 bg-[#2ACAA8] text-white rounded-lg hover:bg-[#23A891] transition text-sm font-medium"
              >
                Upload New Avatar
              </label>
              <input
                type="file"
                id="avatarUpload"
                className="hidden"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files[0])}
              />
              {avatarFile && (
                <p className="text-gray-400 text-sm mt-2">
                  File selected: {avatarFile.name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                />
              </div>
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
                rows="3"
                className="w-full p-3 bg-[#354240] border border-[#455553] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] shadow-sm resize-y"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="department"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Department
                </label>
                <input
                  type="text"
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-3 bg-[#354240] border border-[#455553] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] shadow-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="semester"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Semester
                </label>
                <input
                  type="text"
                  id="semester"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full p-3 bg-[#354240] border border-[#455553] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] shadow-sm"
                />
              </div>
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
                placeholder="e.g., Reading, Hiking, Coding"
                className="w-full p-3 bg-[#354240] border border-[#455553] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] shadow-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div>
                <label
                  htmlFor="github"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  GitHub URL
                </label>
                <input
                  type="url"
                  id="github"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/yourusername"
                  className="w-full p-3 bg-[#354240] border border-[#455553] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={profileSaveStatus === "saving"}
              className="w-full py-3 px-8 bg-[#2ACAA8] text-white font-semibold rounded-lg hover:bg-[#23A891] focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] focus:ring-offset-2 focus:ring-offset-[#252F2D] transition duration-300 ease-in-out shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {profileSaveStatus === "saving"
                ? "Saving Profile..."
                : "Save Profile"}
            </button>
            {profileSaveStatus === "success" && (
              <p className="text-green-400 text-center mt-2">
                Profile updated successfully!
              </p>
            )}
            {profileSaveStatus === "error" && (
              <p className="text-red-400 text-center mt-2">
                Failed to update profile. Please try again.
              </p>
            )}
          </form>
        </section>

        <section className="mb-10 p-6 bg-[#252F2D]/70 rounded-xl border border-[#3A3A4D]/50 shadow-md">
          <h2 className="text-2xl font-semibold text-[#2ACAA8] mb-6">
            Account Security
          </h2>
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-3 bg-[#354240] border border-[#455553] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] shadow-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 bg-[#354240] border border-[#455553] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] shadow-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="confirmNewPassword"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full p-3 bg-[#354240] border border-[#455553] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] shadow-sm"
                required
              />
            </div>
            <button
              type="submit"
              disabled={passwordChangeStatus === "changing"}
              className="w-full py-3 px-8 bg-[#2ACAA8] text-white font-semibold rounded-lg hover:bg-[#23A891] focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] focus:ring-offset-2 focus:ring-offset-[#252F2D] transition duration-300 ease-in-out shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {passwordChangeStatus === "changing"
                ? "Changing Password..."
                : "Change Password"}
            </button>
            {passwordChangeStatus === "success" && (
              <p className="text-green-400 text-center mt-2">
                Password changed successfully!
              </p>
            )}
            {passwordChangeStatus === "error" && (
              <p className="text-red-400 text-center mt-2">
                Failed to change password. Please check your current password.
              </p>
            )}
          </form>
        </section>

        <section className="p-6 bg-[#252F2D]/70 rounded-xl border border-[#3A3A4D]/50 shadow-md">
          <h2 className="text-2xl font-semibold text-[#2ACAA8] mb-4">
            Your User ID
          </h2>
          <p className="text-gray-300 text-lg break-all">
            {user?.uid || "Not logged in"}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            This is your unique identifier in the system.
          </p>
        </section>
      </div>
    </div>
  );
}
