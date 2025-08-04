"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

const faqs = [
  {
    question: "What is KUPals?",
    answer:
      "KUPals is a student-built platform for Kathmandu University students. It's designed to help you with productivity, connect with peers, and build a stronger community. Our features include a to-do list, habit tracker, and a universal group chat.",
  },
  {
    question: "How do I sign up for KUPals?",
    answer:
      "You can sign up by navigating to the 'Create Account' page and providing your details. We offer a simple email/password registration, or you can sign up with your Google account for a quick start.",
  },
  {
    question: "Is KUPals free to use?",
    answer:
      "Yes, KUPals is completely free for all Kathmandu University students. We are committed to providing a valuable tool for the student community without any cost.",
  },
  {
    question: "What features are included in the productivity tools?",
    answer:
      "The platform includes a robust to-do list to help you manage your assignments and tasks, and a habit tracker to help you build and maintain positive routines throughout your semester.",
  },
  {
    question: "How do I connect with other students?",
    answer:
      "KUPals features a universal group chat where all students can connect in real-time. Additionally, we plan to introduce interest-based groups and a peer-to-peer messaging system to help you build meaningful connections.",
  },
  {
    question: "Who can I contact for support or to report an issue?",
    answer:
      "You can use the feedback form on our 'About Us' page to report any issues or share your suggestions. Your input is valuable in helping us improve the platform.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-[#1A1A1A] px-4 py-12 flex flex-col items-center font-sans text-white">
      <section className="text-center mb-16 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          <span className="block text-transparent bg-clip-text bg-gradient-to-br from-[#7fe0e0] to-white drop-shadow-[0_1px_10px_rgba(42,202,168,0.4)]">
            Frequently Asked Questions
          </span>
        </h1>
        <p className="text-lg text-gray-300">
          Everything you need to know about KUPals, all in one place.
        </p>
      </section>

      <div className="w-full max-w-4xl bg-[#252F2D]/70 rounded-2xl shadow-2xl p-8 md:p-12 backdrop-blur-lg border border-[#3A3A4D]/50">
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-[#354240]/60 p-5 rounded-xl shadow-md border border-[#455553]/50 backdrop-blur-sm transition-all duration-300 ease-in-out"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left flex justify-between items-center text-white focus:outline-none"
              >
                <span className="text-lg font-semibold">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUpIcon className="h-6 w-6 text-[#2ACAA8]" />
                ) : (
                  <ChevronDownIcon className="h-6 w-6 text-[#2ACAA8]" />
                )}
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index ? "max-h-96 mt-4" : "max-h-0"
                }`}
              >
                <p className="text-gray-300 pt-2">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <section className="text-center border-t border-[#3A3A4D]/50 pt-12 mt-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Still have questions?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Feel free to reach out to us with your queries. We are here to help!
          </p>
          <Link href="/about">
            <button className="py-3 px-8 bg-[#2ACAA8] text-white font-semibold rounded-lg hover:bg-[#23A891] focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] focus:ring-offset-2 focus:ring-offset-[#252F2D] transition duration-300 ease-in-out shadow-lg">
              Contact Us via Feedback Form
            </button>
          </Link>
        </section>
      </div>
    </main>
  );
}
