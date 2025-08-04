"use client";

import Link from "next/link";
import Cubes from "@/components/backgrounds/cubes";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white font-sans overflow-hidden relative">
      <div className="absolute inset-0 z-0 opacity-10">
        <Cubes
          gridSize={20}
          radius={2}
          maxAngle={30}
          rippleSpeed={1}
          autoAnimate={true}
          rippleOnClick={false}
          faceColor="#1A1A1A"
          borderStyle="1px solid rgba(42,202,168,0.2)"
          shadow={false}
          cubeSize={null}
        />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-8 md:py-16">
        <nav className="flex justify-between items-center py-4 mb-12">
          <div className="text-2xl font-bold text-white drop-shadow-md">
            KUPals
          </div>
          <div className="space-x-6">
            <Link
              href="/"
              className="text-gray-300 hover:text-[#2ACAA8] transition-colors duration-300"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-300 hover:text-[#2ACAA8] transition-colors duration-300"
            >
              About
            </Link>
            <Link
              href="/faqs"
              className="text-gray-300 hover:text-[#2ACAA8] transition-colors duration-300"
            >
              FAQs
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-300 hover:text-[#2ACAA8] transition-colors duration-300"
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="text-gray-300 hover:text-[#2ACAA8] transition-colors duration-300"
            >
              Profile
            </Link>
            <Link href="/create-account">
              <button className="py-2 px-4 bg-[#2ACAA8] text-white rounded-md hover:bg-[#23A891] transition duration-300 ease-in-out">
                Sign Up / Login
              </button>
            </Link>
          </div>
        </nav>

        <section className="text-center mb-20 p-8 rounded-2xl bg-[#252F2D]/30 backdrop-blur-md border border-[#3A3A4D]/50 shadow-lg animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            <span className="block text-white/90">Welcome to</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#2ACAA8] to-[#3CE6BD] drop-shadow-[0_0_15px_rgba(42,202,168,0.6)] animate-pulse-glow">
              KUPals!
            </span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            A Web-Based Social Platform for Kathmandu University Students
          </p>
          <Link href="/create-account">
            <button className="py-3 px-8 bg-[#2ACAA8] text-white font-semibold rounded-lg hover:bg-[#23A891] focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] focus:ring-offset-2 focus:ring-offset-[#252F2D] transition duration-300 ease-in-out shadow-lg transform hover:scale-105">
              Join the KU Community Today!
            </button>
          </Link>
        </section>

        <section className="mb-20 p-8 rounded-2xl bg-[#252F2D]/30 backdrop-blur-md border border-[#3A3A4D]/50 shadow-lg animate-fade-in">
          <h2 className="text-3xl font-bold text-[#2ACAA8] mb-6 text-center">
            Project Overview
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed mb-4">
            KUPals is a lightweight, web-based social platform designed
            specifically for students at Kathmandu University. In a university
            setting, students often lack a centralized platform for connecting
            over shared interests and organizing social and academic activities.
            KUPals bridges that gap by providing:
          </p>
          <ul className="list-disc list-inside text-lg text-gray-300 space-y-2 pl-4">
            <li>
              Public interest groups (e.g., art, music, hiking, coding clubs)
            </li>
            <li>Private groups for focused academic or social discussions</li>
            <li>Real-time chat and notifications</li>
            <li>Secure user authentication via Email/Google</li>
            <li>Responsive UI built with React and Tailwind CSS</li>
            <li>Scalable backend using Firebase services</li>
          </ul>
        </section>

        <section className="mb-20 p-8 rounded-2xl bg-[#252F2D]/30 backdrop-blur-md border border-[#3A3A4D]/50 shadow-lg animate-fade-in">
          <h2 className="text-3xl font-bold text-[#2ACAA8] mb-8 text-center">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#354240]/60 p-6 rounded-xl shadow-md border border-[#455553]/50 backdrop-blur-sm text-center transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-white mb-3">
                Public Interest Groups
              </h3>
              <p className="text-gray-300 text-base">
                Discover and join groups based on your passions.
              </p>
            </div>
            <div className="bg-[#354240]/60 p-6 rounded-xl shadow-md border border-[#455553]/50 backdrop-blur-sm text-center transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-white mb-3">
                Private Collaboration Groups
              </h3>
              <p className="text-gray-300 text-base">
                Create invite-only groups for focused discussions.
              </p>
            </div>
            <div className="bg-[#354240]/60 p-6 rounded-xl shadow-md border border-[#455553]/50 backdrop-blur-sm text-center transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-white mb-3">
                Real-Time Chat & Notifications
              </h3>
              <p className="text-gray-300 text-base">
                Stay connected with instant messaging and alerts.
              </p>
            </div>
            <div className="bg-[#354240]/60 p-6 rounded-xl shadow-md border border-[#455553]/50 backdrop-blur-sm text-center transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-white mb-3">
                User Authentication & Profiles
              </h3>
              <p className="text-gray-300 text-base">
                Secure login and personalized profiles.
              </p>
            </div>
            <div className="bg-[#354240]/60 p-6 rounded-xl shadow-md border border-[#455553]/50 backdrop-blur-sm text-center transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-white mb-3">
                Privacy & Security
              </h3>
              <p className="text-gray-300 text-base">
                Built with Firebase Authentication and Firestore Security Rules.
              </p>
            </div>
            <div className="bg-[#354240]/60 p-6 rounded-xl shadow-md border border-[#455553]/50 backdrop-blur-sm text-center transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-white mb-3">
                Responsive UI
              </h3>
              <p className="text-gray-300 text-base">
                Optimized for mobile, tablet, and desktop devices.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-20 p-8 rounded-2xl bg-[#252F2D]/30 backdrop-blur-md border border-[#3A3A4D]/50 shadow-lg animate-fade-in">
          <h2 className="text-3xl font-bold text-[#2ACAA8] mb-6 text-center">
            Technologies Used
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-300 text-lg">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Frontend
              </h3>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li>React.js</li>
                <li>Next.js (App Router)</li>
                <li>Tailwind CSS</li>
                <li>Context API</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Backend</h3>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li>Firebase Authentication</li>
                <li>Firestore</li>
                <li>Firebase Storage</li>
                <li>Firebase Hosting</li>
                <li>Firebase Cloud Functions (future use)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Development Tools
              </h3>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li>ESLint & Prettier</li>
                <li>Jest & Firebase Emulator Suite</li>
                <li>React DevTools</li>
                <li>GitHub Actions (optional)</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="text-center mb-20 p-8 rounded-2xl bg-[#252F2D]/30 backdrop-blur-md border border-[#3A3A4D]/50 shadow-lg animate-fade-in">
          <h2 className="text-3xl font-bold text-white mb-6">
            Explore Our Code
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            KUPals is an open-source project. Feel free to explore our codebase,
            contribute, or provide feedback on GitHub!
          </p>
          <Link
            href="https://github.com/SemProjectGroup/KUPals"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="py-3 px-8 bg-[#2ACAA8] text-white font-semibold rounded-lg hover:bg-[#23A891] focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] focus:ring-offset-2 focus:ring-offset-[#252F2D] transition duration-300 ease-in-out shadow-lg transform hover:scale-105">
              Visit GitHub Repository
            </button>
          </Link>
        </section>

        <footer className="text-center text-gray-400 text-sm pt-12 border-t border-[#3A3A4D]/50">
          &copy; {new Date().getFullYear()} KUPals. All rights reserved.
        </footer>
      </main>

      <style jsx>{`
        @keyframes pulse-glow {
          0%,
          100% {
            text-shadow: 0 0 5px rgba(42, 202, 168, 0.4),
              0 0 10px rgba(42, 202, 168, 0.3), 0 0 15px rgba(42, 202, 168, 0.2);
          }
          50% {
            text-shadow: 0 0 10px rgba(42, 202, 168, 0.8),
              0 0 20px rgba(42, 202, 168, 0.6), 0 0 30px rgba(42, 202, 168, 0.4);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInDelay {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in-up {
          animation: fadeIn 1s ease-out forwards;
        }

        .animate-fade-in {
          animation: fadeInDelay 1s ease-out forwards;
          animation-delay: 0.5s;
          opacity: 0;
        }

        section:nth-of-type(2) {
          animation-delay: 0.8s;
        }
        section:nth-of-type(3) {
          animation-delay: 1.1s;
        }
        section:nth-of-type(4) {
          animation-delay: 1.4s;
        }
        section:nth-of-type(5) {
          animation-delay: 1.7s;
        }
      `}</style>
    </div>
  );
}
