"use client";

import { useState, useEffect, useRef, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { AuthContext } from "@/context/authContext";

function createAvatarPlaceholder(name) {
  const initial = name ? name.charAt(0).toUpperCase() : "U";
  const bgColor = "#3CE6BD";
  const textColor = "#FFFFFF";
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="${bgColor}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="50" font-family="Arial, sans-serif" fill="${textColor}">${initial}</text></svg>`;
  const encodedSvg = encodeURIComponent(svgContent);
  return `data:image/svg+xml,${encodedSvg}`;
}

export default function GroupChat() {
  const groupId = useParams().gruopId;
  const { user, profile, loading: authLoading } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [groupName, setGroupName] = useState("Loading Group...");
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const firebaseConfig = JSON.parse(
    typeof __firebase_config !== "undefined" ? __firebase_config : "{}"
  );
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const db = getFirestore(app);
  const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setLoading(false);
      return;
    }

    if (groupId) {
      const groupDocRef = doc(
        db,
        `artifacts/${appId}/public/data/groups`,
        groupId
      );
      getDoc(groupDocRef)
        .then((groupSnap) => {
          if (groupSnap.exists()) {
            setGroupName(groupSnap.data().name);
          } else {
            setGroupName("Group Not Found");
          }
        })
        .catch((error) => {
          console.error("Error fetching group details:", error);
          setGroupName("Error Loading Group");
        });

      const chatCollectionRef = collection(
        db,
        `artifacts/${appId}/public/data/groups/${groupId}/chats`
      );
      const unsubscribeMessages = onSnapshot(chatCollectionRef, (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate
            ? doc.data().createdAt.toDate().toISOString()
            : null,
        }));
        fetchedMessages.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        setMessages(fetchedMessages);
        setLoading(false);
      });

      return () => unsubscribeMessages();
    } else {
      setLoading(false);
    }
  }, [authLoading, user, db, groupId, appId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!user || !newMessage.trim() || isSending) {
      return;
    }

    setIsSending(true);
    try {
      const chatCollectionRef = collection(
        db,
        `artifacts/${appId}/public/data/groups/${groupId}/chats`
      );
      await addDoc(chatCollectionRef, {
        text: newMessage,
        createdAt: serverTimestamp(),
        userId: user.uid,
        userName: profile
          ? `${profile.firstName} ${profile.lastName}`.trim()
          : "Anonymous",
        userAvatar:
          profile?.avatarUrl || createAvatarPlaceholder(profile?.firstName),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  if (authLoading || loading || !groupId) {
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
    <div className="min-h-screen bg-[#1A1A1A] py-8 flex items-center justify-center font-sans">
      <div className="w-full max-w-3xl bg-[#252F2D] rounded-2xl shadow-xl flex flex-col h-[80vh]">
        <div className="p-6 border-b border-[#354240] text-white">
          <h2 className="text-2xl font-bold">{groupName}</h2>
          <p className="text-sm text-gray-400">
            Group ID: <span className="font-mono">{groupId}</span>
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
                  msg.userId === user.uid ? "justify-end" : ""
                }`}
              >
                {msg.userId !== user.uid && (
                  <Link href={`/profile/detailed/${msg.userId}`}>
                    <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 cursor-pointer">
                      <img
                        src={
                          msg.userAvatar ||
                          createAvatarPlaceholder(msg.userName)
                        }
                        alt="Avatar"
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                        }}
                        className="rounded-full"
                        onError={(e) => {
                          e.target.src = createAvatarPlaceholder(msg.userName);
                        }}
                      />
                    </div>
                  </Link>
                )}
                <div
                  className={`flex flex-col ${
                    msg.userId === user.uid ? "items-end" : "items-start"
                  }`}
                >
                  <Link href={`/profile/detailed/${msg.userId}`}>
                    <span
                      className={`text-sm font-semibold ${
                        msg.userId === user.uid
                          ? "text-[#2ACAA8]"
                          : "text-white"
                      } cursor-pointer hover:underline`}
                    >
                      {msg.userName || "Anonymous"}
                    </span>
                  </Link>
                  <div
                    className={`p-3 rounded-xl max-w-[75%] ${
                      msg.userId === user.uid
                        ? "bg-[#2ACAA8] text-white rounded-br-none"
                        : "bg-[#354240] text-white rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm break-all whitespace-pre-wrap">
                      {msg.text}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Sending..."}
                  </span>
                </div>
                {msg.userId === user.uid && (
                  <Link href={`/profile/detailed/${msg.userId}`}>
                    <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 cursor-pointer">
                      <img
                        src={
                          profile?.avatarUrl ||
                          createAvatarPlaceholder(profile?.firstName)
                        }
                        alt="Avatar"
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                        }}
                        className="rounded-full"
                        onError={(e) => {
                          e.target.src = createAvatarPlaceholder(
                            profile?.firstName
                          );
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
