"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState, useContext } from "react";
import Image from "next/image";
import { AuthContext } from "@/context/authContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "FAQs", href: "/faqs" },
    { name: "Profile", href: "/profile" + (user ? `/${user.uid}` : "") },
  ];

  return (
    <header className="w-full bg-[#062626]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="Logo" width={80} height={80} />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white hover:text-gray-300 transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Sign-up Button */}
          <div className="hidden md:block">
            <Link href="/sign-in">
              <button className="bg-[#2ACAA8] text-white font-medium px-6 py-2 rounded-md hover:opacity-90 transition-opacity duration-200">
                Sign-In
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:bg-white/10 p-2 rounded-md transition-colors duration-200"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
              <span className="sr-only">Toggle menu</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-white/10">
              {/* Mobile Navigation Links */}
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white hover:text-gray-300 block px-3 py-2 text-base font-medium transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Sign-up Button */}
              <div className="pt-4">
                <Link href="/sign-in">
                  <button
                    className="bg-[#2ACAA8] text-white font-medium px-6 py-2 rounded-md hover:opacity-90 transition-opacity duration-200 w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign-In
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
