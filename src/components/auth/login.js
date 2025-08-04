// Praful Bhatt roll 61
"use client";

import Link from "next/link";
import { useState } from "react";
import LoginForm from "./loginForm";
import RegisterForm from "./registerForm";
import LeftColumn from "./leftColumn";

export default function CreateAccountPage() {
  const [isRegisterMode, setIsRegisterMode] = useState(true);

  const toggleMode = (mode) => {
    setIsRegisterMode(mode);
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="bg-[#252F2D] rounded-2xl shadow-2xl flex flex-col md:flex-row max-w-5xl overflow-hidden">
        <LeftColumn />

        <div className="w-full md:w-3/5 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-[#252F2D] rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none">
          {isRegisterMode ? (
            <>
              <h2 className="text-3xl font-bold text-white mb-2">
                Create an account
              </h2>
              <p className="text-sm text-gray-400 mb-8">
                Already have an account?{" "}
                <button
                  onClick={() => toggleMode(false)}
                  className="text-[#2ACAA8] hover:underline focus:outline-none"
                >
                  Login
                </button>
              </p>
              <RegisterForm />
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-white mb-2">
                Login to your account
              </h2>
              <p className="text-sm text-gray-400 mb-8">
                Don't have an account?{" "}
                <button
                  onClick={() => toggleMode(true)}
                  className="text-[#2ACAA8] hover:underline focus:outline-none"
                >
                  Create an account
                </button>
              </p>
              <LoginForm />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
