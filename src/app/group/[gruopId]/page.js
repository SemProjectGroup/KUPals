"use client";

import { useState, useEffect, useRef, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
  deleteDoc,
  getDocs,
  writeBatch,
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
  const router = useRouter();
  const { user, profile, loading: authLoading } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [groupName, setGroupName] = useState("Loading Group...");
  const [groupOwnerId, setGroupOwnerId] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
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
            setGroupOwnerId(groupSnap.data().createdBy);
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

  const handleDeleteMessage = async (messageId) => {
    if (!user || !groupId) return;

    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        const messageDocRef = doc(
          db,
          `artifacts/${appId}/public/data/groups/${groupId}/chats`,
          messageId
        );
        await deleteDoc(messageDocRef);
      } catch (error) {
        console.error("Error deleting message:", error);
        alert("Failed to delete message. Please check permissions.");
      }
    }
  };

  const handleDeleteGroup = async () => {
    if (!user || user.uid !== groupOwnerId) {
      alert("You do not have permission to delete this group.");
      return;
    }

    if (
      window.confirm(
        "Are you sure you want to delete this entire group? This action cannot be undone."
      )
    ) {
      try {
        const groupDocRef = doc(
          db,
          `artifacts/${appId}/public/data/groups`,
          groupId
        );

        // Delete all messages in the group's chat subcollection
        const chatCollectionRef = collection(
          db,
          `artifacts/${appId}/public/data/groups/${groupId}/chats`
        );
        const chatSnapshot = await getDocs(chatCollectionRef);
        const batch = writeBatch(db);
        chatSnapshot.docs.forEach((d) => {
          batch.delete(d.ref);
        });
        await batch.commit();

        // Delete the group document itself
        await deleteDoc(groupDocRef);

        // Redirect to dashboard or groups page after deletion
        router.push("/dashboard"); // Or '/groups'
      } catch (error) {
        console.error("Error deleting group:", error);
        alert("Failed to delete group. Please check permissions.");
      }
    }
  };

  const fetchGroupMembers = async () => {
    if (!user || !groupId) return;
    setGroupMembers([]); // Clear previous members
    try {
      const membersCollectionRef = collection(
        db,
        `artifacts/${appId}/public/data/groups/${groupId}/members`
      );
      const snapshot = await getDocs(membersCollectionRef);
      const membersData = [];
      for (const memberDoc of snapshot.docs) {
        const memberId = memberDoc.id;
        // Fetch user profile for display name and avatar
        const userProfileRef = doc(db, `artifacts/${appId}/users`, memberId);
        const userProfileSnap = await getDoc(userProfileRef);
        if (userProfileSnap.exists()) {
          const userData = userProfileSnap.data();
          membersData.push({
            id: memberId,
            name:
              `${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
              "Anonymous",
            avatar:
              userData.avatarUrl || createAvatarPlaceholder(userData.firstName),
          });
        } else {
          membersData.push({
            id: memberId,
            name: "Unknown User",
            avatar: createAvatarPlaceholder("Unknown"),
          });
        }
      }
      setGroupMembers(membersData);
    } catch (error) {
      console.error("Error fetching group members:", error);
      alert("Failed to fetch group members.");
    }
  };

  const handleRemoveMember = async (memberIdToRemove) => {
    if (!user || user.uid !== groupOwnerId) {
      alert("You do not have permission to remove members.");
      return;
    }
    if (memberIdToRemove === user.uid) {
      alert(
        "You cannot remove yourself from the group as the owner. Delete the group instead."
      );
      return;
    }

    if (window.confirm(`Are you sure you want to remove this member?`)) {
      try {
        const batch = writeBatch(db);

        // 1. Remove member from the group's public members list
        const publicMemberDocRef = doc(
          db,
          `artifacts/${appId}/public/data/groups/${groupId}/members`,
          memberIdToRemove
        );
        batch.delete(publicMemberDocRef);

        // 2. Remove the group reference from the user's private groups list
        const userGroupDocRef = doc(
          db,
          `artifacts/${appId}/users/${memberIdToRemove}/groups`,
          groupId
        );
        batch.delete(userGroupDocRef);

        await batch.commit();
        alert("Member removed successfully.");
        fetchGroupMembers(); // Refresh the list
      } catch (error) {
        console.error("Error removing member:", error);
        alert("Failed to remove member. Please check permissions.");
      }
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
        <div className="p-6 border-b border-[#354240] text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{groupName}</h2>
            <p className="text-sm text-gray-400">
              Group ID: <span className="font-mono">{groupId}</span>
            </p>
          </div>
          <div className="flex space-x-2">
            {user.uid === groupOwnerId && (
              <button
                onClick={() => {
                  setShowMembersModal(true);
                  fetchGroupMembers();
                }}
                className="px-4 py-2 bg-[#2ACAA8] text-white rounded-md hover:bg-[#23A891] transition text-sm"
              >
                Manage Members
              </button>
            )}
            {user.uid === groupOwnerId && (
              <button
                onClick={handleDeleteGroup}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm"
              >
                Delete Group
              </button>
            )}
          </div>
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
                    className={`group relative p-3 rounded-xl max-w-[75%] ${
                      msg.userId === user.uid
                        ? "bg-[#2ACAA8] text-white rounded-br-none"
                        : "bg-[#354240] text-white rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm break-all whitespace-pre-wrap">
                      {msg.text}
                    </p>
                    {(msg.userId === user.uid || user.uid === groupOwnerId) && (
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="absolute top-1 right-1 text-gray-200 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-full bg-black/20"
                        title="Delete message"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm2 3a1 1 0 011-1h4a1 1 0 110 2H9a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    )}
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

      {showMembersModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-[#252F2D] rounded-2xl shadow-xl p-8 w-full max-w-md border border-[#3A3A4D]/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Group Members</h2>
              <button
                onClick={() => setShowMembersModal(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                &times;
              </button>
            </div>
            {groupMembers.length === 0 ? (
              <p className="text-gray-400 text-center">No members found.</p>
            ) : (
              <ul className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
                {groupMembers.map((member) => (
                  <li
                    key={member.id}
                    className="flex items-center justify-between bg-[#354240] p-3 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={member.avatar}
                        alt="Member Avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-white font-medium">
                        {member.name}
                      </span>
                    </div>
                    {user.uid === groupOwnerId &&
                      member.id !== user.uid && ( // Owner can't remove themselves
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-400 hover:text-red-600 transition"
                          title="Remove member"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm2 3a1 1 0 011-1h4a1 1 0 110 2H9a1 1 0 01-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      )}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowMembersModal(false)}
                className="py-2 px-6 bg-[#2ACAA8] text-white rounded-md hover:bg-[#23A891] transition duration-300 ease-in-out"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
