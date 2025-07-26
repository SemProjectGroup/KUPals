"use client";

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";

import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/authContext";

export default function DetailedProfileView() {
  const router = useRouter();
  const params = useParams();
  const userIdToView = params.slug;

  const {
    user: currentUser,
    loading: authLoading,
    getUserProfile,
  } = useContext(AuthContext);

  const [viewedProfile, setViewedProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userIdToView) {
        setProfileError("No user ID provided in URL.");
        setProfileLoading(false);
        return;
      }

      setProfileLoading(true);
      setProfileError(null);
      try {
        const profileData = await getUserProfile(userIdToView);
        if (profileData) {
          setViewedProfile(profileData);
        } else {
          setProfileError("Profile not found or no data available.");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setProfileError("Failed to load profile.");
      } finally {
        setProfileLoading(false);
      }
    };

    if (userIdToView && !authLoading) {
      fetchProfile();
    }
  }, [userIdToView, authLoading, getUserProfile]);

  if (authLoading || profileLoading) {
    return (
      <main className="min-h-screen bg-[#051818] flex items-center justify-center text-white">
        <p>Loading profile...</p>
      </main>
    );
  }

  if (profileError) {
    return (
      <main className="min-h-screen bg-[#051818] flex items-center justify-center text-red-400">
        <p>{profileError}</p>
      </main>
    );
  }

  if (!viewedProfile) {
    return (
      <main className="min-h-screen bg-[#051818] flex items-center justify-center text-gray-400">
        <p>No profile data to display.</p>
      </main>
    );
  }

  const isOwnProfile = currentUser && currentUser.uid === userIdToView;

  const user = viewedProfile;
  return (
    <main className="min-h-screen bg-[#051818] px-6 py-12 text-white flex flex-col items-center">
      <h1 className="text-center text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
        <span className="block text-white/70">
          {isOwnProfile ? "Welcome back," : "Viewing Profile of,"}
        </span>
        <span className="block text-transparent bg-clip-text bg-gradient-to-br from-[#7fe0e0] to-white drop-shadow-[0_1px_10px_rgba(21,128,128,0.6)]">
          {user.firstName || user.name || "User"}
        </span>
      </h1>

      {isOwnProfile && (
        <Link href="/profile">
          <button className="mb-10 px-5 py-2 rounded-lg bg-[#104d4d]/70 hover:bg-[#158080] transition-all font-semibold shadow-md">
            ← Edit Your Profile
          </button>
        </Link>
      )}

      <div
        className={`w-full max-w-5xl p-8 md:p-12 bg-[#252F2D] rounded-2xl shadow-xl`}
      >
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
          <div className="flex-shrink-0">
            <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-[#2ACAA8] shadow-lg">
              <Image
                src={user.avatarUrl || "/placeholder-avatar.png"}
                alt="User Avatar"
                layout="fill"
                objectFit="cover"
                onError={(e) => {
                  e.target.src = "/placeholder-avatar.png";
                }}
              />
            </div>
          </div>

          <div>
            <h1 className={`text-4xl font-bold mb-2`}>
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-[#7fe0e0] text-sm mb-4">{user.email}</p>
            <p className="text-white/70 text-base max-w-2xl leading-relaxed">
              {user.bio || "No bio available."}
            </p>

            <div className="mt-6 space-y-2 text-white/80">
              {user.department && (
                <p>
                  <strong>Department:</strong> {user.department}
                </p>
              )}
              {user.semester && (
                <p>
                  <strong>Semester:</strong> {user.semester}
                </p>
              )}
              {user.hobbies && user.hobbies.length > 0 && (
                <p>
                  <strong>Hobbies:</strong> {user.hobbies.join(", ")}
                </p>
              )}
              {user.groups && user.groups.length > 0 && (
                <p>
                  <strong>Groups:</strong> {user.groups.join(", ")}
                </p>
              )}
            </div>

            <div className="flex gap-6 mt-6 text-[#7fe0e0] text-lg font-medium">
              {user.socials?.linkedin && (
                <a
                  href={user.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#adebeb] transition"
                >
                  LinkedIn
                </a>
              )}
              {user.socials?.github && (
                <a
                  href={user.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#adebeb] transition"
                >
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
