import React from "react";
import Button from "../ui/button";
import GoogleSvg from "./googleSvg";
import { useRouter } from "next/navigation";

import { AuthContext } from "../../context/authContext";

import { useState, useContext } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const loginForm = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { user, loading, signIn, signInWithGoogle } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      await signIn(email, password);
      alert("Signed in successfully!");
      router.push("/profile");
    } catch (error) {
      console.error("Email/Password sign-in error:", error.message);
      alert("Login failed: " + error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      alert("Signed in with Google successfully!");
      router.push("/profile");
    } catch (error) {
      console.error("Google sign-in error:", error.message);
      alert("Google sign-in failed: " + error.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 bg-[#354240] border border-[#455553] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] shadow-sm transition duration-200"
            required
          />
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 pr-12 bg-[#354240] border border-[#455553] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] shadow-sm transition duration-200"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white focus:outline-none"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        <Button type="submit">Log In</Button>
      </form>
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#3A3A4D]"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-[#252F2D] px-2 text-gray-400">
            Or sign in with
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleGoogleSignIn}
          className="flex-1 py-3 px-4 bg-[#354240] border border-[#455553] rounded-lg text-white flex items-center justify-center font-semibold hover:bg-[#4A4A5D] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-[#252F2D] transition duration-300 ease-in-out shadow-md hover:shadow-lg"
        >
          <GoogleSvg />
          Google
        </button>
      </div>
    </>
  );
};

export default loginForm;
