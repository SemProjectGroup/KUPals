"use client";

import Link from "next/link";
import { useState } from "react";

export default function AboutUsPage() {
  const creators = [
    "Abhinav Bhatt",
    "Prisha Nepal",
    "Praful Bhatt",
    "Prakash Chaudhary",
    "Madhulika Yadav",
  ];

  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackSubject, setFeedbackSubject] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [formStatus, setFormStatus] = useState("");
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setFormStatus("sending");

    try {
      console.log("Feedback submitted:", {
        feedbackName,
        feedbackEmail,
        feedbackSubject,
        feedbackMessage,
      });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setFormStatus("success");
      setFeedbackName("");
      setFeedbackEmail("");
      setFeedbackSubject("");
      setFeedbackMessage("");
    } catch (error) {
      console.error("Feedback submission error:", error);
      setFormStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-[#1A1A1A] px-4 py-12 flex flex-col items-center font-sans text-white">
      <section className="text-center mb-16 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          <span className="block text-white/80">Connecting Minds,</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-br from-[#7fe0e0] to-white drop-shadow-[0_1px_10px_rgba(42,202,168,0.4)]">
            Empowering Futures at KU
          </span>
        </h1>
        <p className="text-lg text-gray-300">
          Welcome to KUPals, your dedicated platform for a more connected and
          productive university life.
        </p>
      </section>

      <div className="w-full max-w-5xl bg-[#252F2D]/70 rounded-2xl shadow-2xl p-8 md:p-12 backdrop-blur-lg border border-[#3A3A4D]/50">
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-[#2ACAA8] mb-6 text-center">
            Our Story
          </h2>
          <p className="text-gray-300 leading-relaxed text-lg mb-4">
            Born from the vibrant student community of Kathmandu University,
            KUPals was envisioned by a group of passionate students who saw a
            need for a centralized hub. We realized that while KU fosters
            incredible talent and diverse interests, there wasn't a single,
            intuitive platform to bring everyone together, streamline academic
            tasks, and truly nurture connections beyond the classroom.
          </p>
          <p className="text-gray-300 leading-relaxed text-lg">
            So, we decided to build it ourselves. KUPals is a testament to
            student innovation, designed by students, for students, to bridge
            gaps and enhance every aspect of university life.
          </p>
        </section>

        <section className="mb-12 border-t border-[#3A3A4D]/50 pt-12">
          <h2 className="text-3xl font-bold text-[#2ACAA8] mb-6 text-center">
            Our Mission
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#354240]/60 p-6 rounded-xl shadow-md border border-[#455553]/50 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white mb-3">
                Connect Students
              </h3>
              <p className="text-gray-300 text-base">
                We aim to foster a stronger, more vibrant KU community by making
                it easy for students to find and connect with peers who share
                their interests, whether academic, social, or extracurricular.
              </p>
            </div>
            <div className="bg-[#354240]/60 p-6 rounded-xl shadow-md border border-[#455553]/50 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white mb-3">
                Boost Productivity
              </h3>
              <p className="text-gray-300 text-base">
                From managing assignments with an intuitive to-do list to
                cultivating positive habits with our habit tracker, KUPals
                provides tools designed to help you stay organized and achieve
                your academic goals.
              </p>
            </div>
            <div className="bg-[#354240]/60 p-6 rounded-xl shadow-md border border-[#455553]/50 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white mb-3">
                Build Meaningful Connections
              </h3>
              <p className="text-gray-300 text-base">
                Beyond just connecting, we want to facilitate genuine
                interactions, collaborative learning, and lasting friendships
                through interest-based groups and real-time communication.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12 border-t border-[#3A3A4D]/50 pt-12">
          <h2 className="text-3xl font-bold text-[#2ACAA8] mb-8 text-center">
            Meet the Creators
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {creators.map((name, index) => (
              <div
                key={index}
                className="bg-[#354240]/60 p-6 rounded-xl shadow-md border border-[#455553]/50 backdrop-blur-sm text-center"
              >
                <div className="w-24 h-24 bg-[#2ACAA8]/20 rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-bold text-[#2ACAA8] border border-[#2ACAA8]/50">
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h3 className="text-xl font-semibold text-white">{name}</h3>
                <p className="text-gray-400 text-sm">
                  {name == "Praful Bhatt"
                    ? "Full Stack Developer"
                    : "Role/Contribution"}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12 border-t border-[#3A3A4D]/50 pt-12">
          <h2 className="text-3xl font-bold text-[#2ACAA8] mb-6 text-center">
            Send Us Your Feedback!
          </h2>
          <p className="text-gray-300 text-center mb-8">
            Your insights help us grow. Share your thoughts, suggestions, or
            report any issues.
          </p>
          <form
            onSubmit={handleFeedbackSubmit}
            className="space-y-6 max-w-xl mx-auto"
          >
            <div>
              <label
                htmlFor="feedbackName"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Your Name
              </label>
              <input
                type="text"
                id="feedbackName"
                value={feedbackName}
                onChange={(e) => setFeedbackName(e.target.value)}
                className="w-full p-3 bg-[#354240] border border-[#455553] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] shadow-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="feedbackEmail"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Your Email
              </label>
              <input
                type="email"
                id="feedbackEmail"
                value={feedbackEmail}
                onChange={(e) => setFeedbackEmail(e.target.value)}
                className="w-full p-3 bg-[#354240] border border-[#455553] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] shadow-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="feedbackSubject"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Subject
              </label>
              <input
                type="text"
                id="feedbackSubject"
                value={feedbackSubject}
                onChange={(e) => setFeedbackSubject(e.target.value)}
                className="w-full p-3 bg-[#354240] border border-[#455553] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] shadow-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="feedbackMessage"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Message
              </label>
              <textarea
                id="feedbackMessage"
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                rows="5"
                placeholder="What would you like to tell us?"
                className="w-full p-3 bg-[#354240] border border-[#455553] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] shadow-sm resize-y"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={formStatus === "sending"}
              className="w-full py-3 px-8 bg-[#2ACAA8] text-white font-semibold rounded-lg hover:bg-[#23A891] focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] focus:ring-offset-2 focus:ring-offset-[#252F2D] transition duration-300 ease-in-out shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formStatus === "sending" ? "Sending..." : "Submit Feedback"}
            </button>
            {formStatus === "success" && (
              <p className="text-green-400 text-center mt-4">
                Thank you for your feedback!
              </p>
            )}
            {formStatus === "error" && (
              <p className="text-red-400 text-center mt-4">
                Failed to send feedback. Please try again later.
              </p>
            )}
          </form>
        </section>

        <section className="text-center border-t border-[#3A3A4D]/50 pt-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to enhance your KU experience?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Join KUPals today and become a part of a thriving, supportive, and
            productive university community!
          </p>
          <Link href="/create-account">
            <button className="py-3 px-8 bg-[#2ACAA8] text-white font-semibold rounded-lg hover:bg-[#23A891] focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] focus:ring-offset-2 focus:ring-offset-[#252F2D] transition duration-300 ease-in-out shadow-lg">
              Join the KU Community Today!
            </button>
          </Link>
        </section>
      </div>
    </main>
  );
}
