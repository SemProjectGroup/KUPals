"use client";

import Link from "next/link";
import { useState } from "react";

export default function CreateGroupPage() {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [formStatus, setFormStatus] = useState("");

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setFormStatus("sending");

    try {
      console.log("Group creation request submitted:", {
        groupName,
        groupDescription,
      });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setFormStatus("success");
      setGroupName("");
      setGroupDescription("");
    } catch (error) {
      console.error("Group creation error:", error);
      setFormStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-[#1A1A1A] px-4 py-12 flex flex-col items-center font-sans text-white">
      <section className="text-center mb-8 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          <span className="block text-white/80">Start a new space,</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-br from-[#7fe0e0] to-white drop-shadow-[0_1px_10px_rgba(42,202,168,0.4)]">
            Create a KUPals Group
          </span>
        </h1>
        <p className="text-lg text-gray-300">
          Gather your friends or classmates around a common interest or project.
        </p>
      </section>

      <div className="w-full max-w-xl bg-[#252F2D]/70 rounded-2xl shadow-2xl p-8 md:p-12 backdrop-blur-lg border border-[#3A3A4D]/50">
        <h2 className="text-3xl font-bold text-[#2ACAA8] mb-6 text-center">
          Group Details
        </h2>
        <form onSubmit={handleCreateGroup} className="space-y-6">
          <div>
            <label
              htmlFor="groupName"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Group Name
            </label>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full p-3 bg-[#354240] border border-[#455553] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] shadow-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="groupDescription"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Group Description (Optional)
            </label>
            <textarea
              id="groupDescription"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              rows="4"
              placeholder="Tell others what this group is about..."
              className="w-full p-3 bg-[#354240] border border-[#455553] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] shadow-sm resize-y"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={formStatus === "sending" || !groupName}
            className="w-full py-3 px-8 bg-[#2ACAA8] text-white font-semibold rounded-lg hover:bg-[#23A891] focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] focus:ring-offset-2 focus:ring-offset-[#252F2D] transition duration-300 ease-in-out shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formStatus === "sending" ? "Creating..." : "Create Group"}
          </button>
          {formStatus === "success" && (
            <p className="text-green-400 text-center mt-4">
              Group created successfully!
            </p>
          )}
          {formStatus === "error" && (
            <p className="text-red-400 text-center mt-4">
              Failed to create group. Please try again.
            </p>
          )}
        </form>
        <div className="text-center mt-8">
          <Link href="/">
            <button className="text-[#2ACAA8] hover:underline">
              Go back to Home
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
