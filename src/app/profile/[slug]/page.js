"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/authContext";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ViewProfilePage() {
  const {
    user: currentUser,
    loading: authLoading,
    getUserProfile,
  } = useContext(AuthContext);
  const params = useParams();
  const userIdToView = params.slug;

  const [viewedProfile, setViewedProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userIdToView) {
        setProfileError("No user ID provided.");
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
          setProfileError("Profile not found.");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setProfileError("Failed to load profile.");
      } finally {
        setProfileLoading(false);
      }
    };

    if (!authLoading) {
      fetchProfile();
    }
  }, [userIdToView, authLoading, getUserProfile]);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <p className="text-white">Loading profile...</p>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <p className="text-red-400 text-center">{profileError}</p>
      </div>
    );
  }

  if (!viewedProfile) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <p className="text-gray-400 text-center">
          Profile data could not be loaded.
        </p>
      </div>
    );
  }

  const isOwnProfile = currentUser && currentUser.uid === userIdToView;

  return (
    <div className="min-h-screen bg-[#1A1A1A] py-8 flex items-center justify-center">
      <div className="max-w-2xl mx-auto bg-[#252F2D] rounded-2xl shadow-xl p-8 text-white w-full">
        <div className="flex flex-col items-center gap-6 mb-8">
          <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-[#2ACAA8] shadow-lg">
            <Image
              src={viewedProfile.avatarUrl || "/placeholder-avatar.png"}
              alt={`${viewedProfile.firstName}'s Avatar`}
              layout="fill"
              objectFit="cover"
              onError={(e) => {
                e.target.src = "/placeholder-avatar.png";
              }}
            />
          </div>
          <h2 className="text-4xl font-bold text-center">
            {viewedProfile.firstName} {viewedProfile.lastName}
          </h2>
          <p className="text-gray-400 text-lg">{viewedProfile.email}</p>

          {isOwnProfile && (
            <Link href="/editProfile">
              {" "}
              <button className="mt-4 py-2 px-6 bg-[#2ACAA8] text-white font-medium rounded-lg hover:bg-[#23A891] transition duration-300 ease-in-out shadow-md">
                Edit Your Profile
              </button>
            </Link>
          )}
        </div>

        {viewedProfile.bio && (
          <div className="mb-6 border-t border-gray-700 pt-6">
            <h3 className="text-xl font-semibold mb-2">Bio</h3>
            <p className="text-gray-300 leading-relaxed">{viewedProfile.bio}</p>
          </div>
        )}

        {viewedProfile.hobbies && viewedProfile.hobbies.length > 0 && (
          <div className="mb-6 border-t border-gray-700 pt-6">
            <h3 className="text-xl font-semibold mb-2">Hobbies</h3>
            <div className="flex flex-wrap gap-2">
              {viewedProfile.hobbies.map((hobby, index) => (
                <span
                  key={index}
                  className="bg-[#354240] text-[#2ACAA8] text-sm px-3 py-1 rounded-full"
                >
                  {hobby}
                </span>
              ))}
            </div>
          </div>
        )}

        {viewedProfile.socials &&
          Object.keys(viewedProfile.socials).length > 0 && (
            <div className="mb-6 border-t border-gray-700 pt-6">
              <h3 className="text-xl font-semibold mb-2">Socials</h3>
              <div className="flex flex-wrap gap-4">
                {viewedProfile.socials.instagram && (
                  <a
                    href={viewedProfile.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-[#2ACAA8] transition duration-200 flex items-center"
                  >
                    <svg
                      className="w-6 h-6 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.315 2c2.43 0 2.784.002 3.797.056.843.046 1.48.15 2.07.355.62.205 1.178.487 1.638.947.46.46.742 1.018.947 1.638.205.59.309 1.227.355 2.07.054 1.013.057 1.367.057 3.797s-.003 2.784-.056 3.797c-.046.843-.15 1.48-.355 2.07-.205.62-.487 1.178-.947 1.638-.46.46-1.018.742-1.638.947-.59.205-1.227.309-2.07.355-1.013.054-1.367.057-3.797.057s-2.784-.003-3.797-.056c-.843-.046-1.48-.15-2.07-.355-.62-.205-1.178-.487-1.638-.947-.46-.46-.742-1.018-.947-1.638-.205-.59-.309-1.227-.355-2.07-.054-1.013-.057-1.367-.057-3.797s.003-2.784.056-3.797c.046-.843.15-1.48.355-2.07.205-.62.487-1.178.947-1.638.46-.46 1.018-.742 1.638-.947.59-.205 1.227-.309 2.07-.355C9.537 2.003 9.89 2 12.315 2zm0 2.13c-2.316 0-2.585.003-3.493.052-.71.038-1.16.117-1.478.228-.318.113-.578.273-.82.515-.242.242-.402.502-.515.82-.11.318-.19.768-.228 1.478-.049.908-.052 1.177-.052 3.493s.003 2.585.052 3.493c.038.71.117 1.16.228 1.478.113.318.273.578.515.82.242.242.502.402.82.515.318.11.768.19 1.478.228.908.049 1.177.052 3.493.052s2.585-.003 3.493-.052c.71-.038 1.16-.117 1.478-.228.318-.113.578-.273.82-.515.242-.242.402-.502.515-.82.11-.318.19-.768.228-1.478.049-.908.052-1.177.052-3.493s-.003-2.585-.052-3.493c-.038-.71-.117-1.16-.228-1.478-.113-.318-.273-.578-.515-.82-.242-.242-.502-.402-.82-.515-.318-.11-.768-.19-1.478-.228C14.9 4.13 14.63 4.127 12.315 4.127zM12.315 6.84a5.475 5.475 0 100 10.95 5.475 5.475 0 000-10.95zM12.315 15.22a2.905 2.905 0 110-5.81 2.905 2.905 0 010 5.81zm6.065-8.68a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Instagram
                  </a>
                )}
                {viewedProfile.socials.twitter && (
                  <a
                    href={viewedProfile.socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-[#2ACAA8] transition duration-200 flex items-center"
                  >
                    <svg
                      className="w-6 h-6 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M12.001 2.002C6.477 2.002 2 6.479 2 12.003c0 5.522 4.477 9.998 10.001 9.998 5.523 0 10-4.476 10-9.998 0-5.524-4.477-10.001-10-10.001zm5.117 7.575c.197 4.04-2.843 8.262-7.91 8.262-1.933 0-3.76-.569-5.29-1.543.435.053.876.08 1.32.08 2.613 0 5.02-1.026 6.88-2.843-2.43-.045-4.46-1.65-5.16-3.85.3.05.61.08.92.08.447 0 .88-.057 1.29-.153-2.55-.544-4.46-2.77-4.46-5.464v-.07c.75.417 1.62.677 2.52.707-.6-.4-1.04-1.29-1.04-2.26s.44-1.86 1.04-2.26c1.08.9 2.36 1.49 3.74 1.56.09-.4.18-.79.27-1.18.33-1.46 1.5-2.6 3.03-3.1.86-.28 1.77-.42 2.7-.42.79 0 1.55.15 2.25.43-.29.09-.58.19-.87.29-.6.2-1.18.43-1.76.69.57-.1 1.15-.15 1.74-.15.82 0 1.6.14 2.34.42-.09-.03-.18-.06-.27-.09z" />
                    </svg>
                    Twitter
                  </a>
                )}
                {viewedProfile.socials.linkedin && (
                  <a
                    href={viewedProfile.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-[#2ACAA8] transition duration-200 flex items-center"
                  >
                    <svg
                      className="w-6 h-6 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0zM7.27 20.48H3.74V9.01h3.53v11.47zM5.5 7.33c-1.18 0-2.14-.96-2.14-2.14s.96-2.14 2.14-2.14 2.14.96 2.14 2.14-.96 2.14-2.14 2.14zm15.22 13.15h-3.53v-5.6c0-1.33-.02-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.96v5.69H9.93V9.01h3.39v1.55h.05c.47-.89 1.62-1.83 3.34-1.83 3.58 0 4.23 2.35 4.23 5.42v6.33z" />
                    </svg>
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          )}

        {viewedProfile.groups && viewedProfile.groups.length > 0 && (
          <div className="mb-6 border-t border-gray-700 pt-6">
            <h3 className="text-xl font-semibold mb-2">Groups</h3>
            <div className="flex flex-wrap gap-2">
              {viewedProfile.groups.map((groupId, index) => (
                <span
                  key={index}
                  className="bg-[#354240] text-gray-300 text-sm px-3 py-1 rounded-full"
                >
                  Group ID: {groupId}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
