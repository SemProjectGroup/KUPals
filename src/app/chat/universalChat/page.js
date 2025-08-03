"use client";

import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "@/context/authContext";
import Image from "next/image";
import Link from "next/link";

export default function UniversalChat() {
  const { user, profile, loading, sendMessage, getUniversalMessages } =
    useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    console.log("UniversalChat useEffect: Current user:", user);
    console.log("UniversalChat useEffect: Auth loading:", loading);

    if (!loading && user) {
      console.log(
        "UniversalChat useEffect: User authenticated, setting up message listener."
      );
      const unsubscribe = getUniversalMessages((fetchedMessages) => {
        console.log(
          "UniversalChat: Messages received from Firestore:",
          fetchedMessages
        );
        setMessages(fetchedMessages);
      });
      return () => {
        console.log("UniversalChat useEffect: Cleaning up message listener.");
        unsubscribe();
      };
    } else if (!loading && !user) {
      console.log(
        "UniversalChat useEffect: User not authenticated, not setting up listener."
      );
    }
  }, [user, loading, getUniversalMessages]);

  useEffect(() => {
    console.log("UniversalChat: 'messages' state updated:", messages);
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!user || !newMessage.trim() || isSending) {
      return;
    }

    setIsSending(true);
    try {
      await sendMessage(newMessage);
      setNewMessage("");
      console.log("Message sent successfully (via sendMessage function).");
    } catch (error) {
      alert("Failed to send message: " + error.message);
      console.error("Error sending message in handleSendMessage:", error);
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center text-white">
        <p>Loading chat...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex flex-col items-center justify-center text-white p-4">
        <p className="text-xl mb-4">
          You need to be logged in to join the chat.
        </p>
        <Link href="/create-account">
          <button className="py-2 px-6 bg-[#2ACAA8] text-white rounded-md hover:bg-[#23A891] transition duration-300 ease-in-out">
            Sign Up / Login
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] py-8 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-[#252F2D] rounded-2xl shadow-xl flex flex-col h-[80vh]">
        <div className="p-6 border-b border-[#354240] text-white">
          <h2 className="text-2xl font-bold">Universal Group Chat</h2>
          <p className="text-sm text-gray-400">
            Everyone in KUPals can chat here!
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {messages.length === 0 ? (
            <p className="text-gray-400 text-center mt-10">
              No messages yet. Be the first to say hi!
            </p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  msg.uid === user.uid ? "justify-end" : ""
                }`}
              >
                {msg.uid !== user.uid && (
                  <Link href={`/profile/detailed/${msg.uid}`}>
                    <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 cursor-pointer">
                      <Image
                        src={msg.userAvatar || "/placeholder-avatar.png"}
                        alt="Avatar"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-full"
                        onError={(e) => {
                          e.target.src = "/placeholder-avatar.png";
                        }}
                      />
                    </div>
                  </Link>
                )}
                <div
                  className={`flex flex-col ${
                    msg.uid === user.uid ? "items-end" : "items-start"
                  }`}
                >
                  <Link href={`/profile/detailed/${msg.uid}`}>
                    <span
                      className={`text-sm font-semibold ${
                        msg.uid === user.uid ? "text-[#2ACAA8]" : "text-white"
                      } cursor-pointer hover:underline`}
                    >
                      {msg.userName || "Anonymous"}
                    </span>
                  </Link>
                  <div
                    className={`p-3 rounded-xl max-w-[75%] ${
                      msg.uid === user.uid
                        ? "bg-[#2ACAA8] text-white rounded-br-none"
                        : "bg-[#354240] text-white rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm break-words">{msg.text}</p>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    {msg.createdAt?.toDate
                      ? msg.createdAt.toDate().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Sending..."}
                  </span>
                </div>
                {msg.uid === user.uid && (
                  <Link href={`/profile/detailed/${msg.uid}`}>
                    <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 cursor-pointer">
                      <Image
                        src={msg.userAvatar || "/placeholder-avatar.png"}
                        alt="Avatar"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-full"
                        onError={(e) => {
                          e.target.src = "/placeholder-avatar.png";
                        }}
                      />
                    </div>
                  </Link>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSendMessage}
          className="p-6 border-t border-[#354240] flex gap-4"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 bg-[#354240] border border-[#455553] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] shadow-sm"
            disabled={isSending}
          />
          <button
            type="submit"
            className="py-3 px-6 bg-[#2ACAA8] text-white font-semibold rounded-lg hover:bg-[#23A891] focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] focus:ring-offset-2 focus:ring-offset-[#252F2D] transition duration-300 ease-in-out shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSending || !newMessage.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
