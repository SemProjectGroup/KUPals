"use client";

import Image from "next/image";
import avatarUrl from "@/../public/globe.svg";
import Link from "next/link";

export default function ProfileCard() {
  const user = {
    name: "Praful Bhatt",
    email: "praful@kupals.edu",
    bio: "I’m a 3rd-semester Computer Engineering student at Kathmandu University and one of the core builders behind KUPals — a productivity platform made by students, for students. I love coding, UI design, typing, sketching, reading, and adventure.",
    avatarUrl: avatarUrl,
  };

  return (
    <div className="relative w-full mt-10 max-w-md mx-auto p-6 rounded-3xl glass-profile shadow-[0_0_40px_rgba(21,128,128,0.25)] text-white overflow-hidden">
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <div className="w-96 h-96 bg-[#158080]/20 rounded-full blur-[100px] opacity-40 animate-pulse" />
      </div>

      <div className="relative z-10 w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-[#158080]/70 shadow-[0_0_25px_rgba(21,128,128,0.6)]">
        <Image
          src={user.avatarUrl}
          alt={`${user.name}'s avatar`}
          width={112}
          height={112}
          className="object-cover"
        />
      </div>

      <div className="relative z-10 text-center mt-5">
        <h2 className="text-3xl font-extrabold bg-gradient-to-br from-[#7fe0e0] to-white text-transparent bg-clip-text drop-shadow-[0_1px_15px_rgba(21,128,128,0.8)] tracking-tight">
          {user.name}
        </h2>
        <p className="text-sm text-white/50 mt-1">{user.email}</p>
      </div>

      <p className="relative z-10 mt-4 text-center text-white/70 text-sm leading-relaxed px-2">
        {user.bio}
      </p>

      <div className="relative z-10 mt-6 flex justify-center gap-4">
        <button className="px-5 py-2 rounded-xl bg-[#158080]/80 hover:bg-[#1fa3a3] transition-all duration-300 font-semibold shadow-md hover:scale-105">
          Message
        </button>
        <Link href={`/profile/detailed/${user.id}`}>
          <button className="px-5 py-2 rounded-xl border border-white/20 hover:bg-white/10 text-white/80 font-medium transition duration-300 hover:scale-105">
            View Profile
          </button>
        </Link>
      </div>
    </div>
  );
}
