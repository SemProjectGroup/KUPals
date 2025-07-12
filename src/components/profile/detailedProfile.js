"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./detailedProfile.module.css";

export default function DetailedProfilePage() {
  const router = useRouter();

  const user = {
    name: "Praful Bhatt",
    email: "praful@kupals.edu",
    avatarUrl: "/avatars/praful.png",
    department: "Computer Engineering",
    semester: "3rd Semester",
    bio: `I’m a 3rd-semester Computer Engineering student at Kathmandu University and one of the core builders behind KUPals — a productivity platform made by students, for students. I’m passionate about coding, UI design, typing, sketching, and reading, and I love exploring new technologies and ideas. When I’m not building something new, you’ll probably find me outdoors chasing adventure or sketching ideas in my notebook. I'm driven by curiosity, creativity, and the belief that great software can build strong communities.`,
    hobbies: ["Coding", "Sketching", "Typing", "Reading", "Adventure"],
    socials: {
      linkedin: "https://linkedin.com/in/prafulbhatt",
      github: "https://github.com/prafulbhatt",
    },
    groups: ["KUPals Core Team", "KU Coding Club", "Tech Enthusiasts"],
  };

  return (
    <main className="min-h-screen bg-[#051818] px-6 py-12 text-white flex flex-col items-center">
      <h1 className="text-center text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
        <span className="block text-white/70">Welcome back,</span>
        <span className="block text-transparent bg-clip-text bg-gradient-to-br from-[#7fe0e0] to-white drop-shadow-[0_1px_10px_rgba(21,128,128,0.6)]">
          Praful
        </span>
      </h1>

      <button
        onClick={() => router.back()}
        className="mb-10 px-5 py-2 rounded-lg bg-[#104d4d]/70 hover:bg-[#158080] transition-all font-semibold shadow-md"
      >
        ← Back
      </button>

      <div className={`${styles.card} w-full max-w-5xl p-8 md:p-12`}>
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
          <div className="flex-shrink-0">
            <div className={`${styles.avatarWrapper}`}>
              <Image
                src={user.avatarUrl}
                alt="User Avatar"
                width={160}
                height={160}
                className="rounded-full object-cover"
              />
            </div>
          </div>

          <div>
            <h1 className={`${styles.name} mb-2`}>{user.name}</h1>
            <p className="text-[#7fe0e0] text-sm mb-4">{user.email}</p>
            <p className="text-white/70 text-base max-w-2xl leading-relaxed">
              {user.bio}
            </p>

            <div className="mt-6 space-y-2 text-white/80">
              <p>
                <strong>Department:</strong> {user.department}
              </p>
              <p>
                <strong>Semester:</strong> {user.semester}
              </p>
              <p>
                <strong>Hobbies:</strong> {user.hobbies.join(", ")}
              </p>
              <p>
                <strong>Gruops:</strong> {user.groups.join(", ")}
              </p>
            </div>

            <div className="flex gap-6 mt-6 text-[#7fe0e0] text-lg font-medium">
              <a
                href={user.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#adebeb] transition"
              >
                LinkedIn
              </a>
              <a
                href={user.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#adebeb] transition"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
