"use client";

import UserProfileForm from "@/components/profile/profileForm";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/authContext";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/create-account");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <p className="text-white">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] py-8">
      <UserProfileForm />
    </div>
  );
}
