"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithCustomToken,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
} from "firebase/firestore";
import { useContext } from "react";
import Image from "next/image";
import { AuthContext } from "@/context/authContext";

const KUPalsDashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const [userName, setUserName] = useState("Guest");
  const [userId, setUserId] = useState(null);
  const [myGroups, setMyGroups] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const showAlert = (message) => {
    alert(message);
  };

  const firebaseConfig = JSON.parse(
    typeof __firebase_config !== "undefined" ? __firebase_config : "{}"
  );
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (typeof __initial_auth_token !== "undefined") {
          await signInWithCustomToken(auth, __initial_auth_token);
        }
      } catch (error) {
        console.error("Firebase Auth Error:", error);
      }
    };
    initializeAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || user.email || "User");
        setUserId(user.uid);
        setIsAuthReady(true);
      } else {
        setUserName("Guest");
        setUserId(null);
        setIsAuthReady(true);
        setMyGroups([]);
        setRecentChats([]);
        setNotifications([]);
      }
    });

    return () => unsubscribeAuth();
  }, [auth]);

  useEffect(() => {
    if (!isAuthReady || !userId) {
      return;
    }

    const unsubscribeGroups = onSnapshot(
      query(collection(db, `artifacts/${appId}/users/${userId}/groups`)),
      (snapshot) => {
        const groupsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMyGroups(groupsData);
      },
      (error) => {
        console.error("Error fetching groups:", error);
        showAlert("Failed to load groups.");
      }
    );

    const unsubscribeChats = onSnapshot(
      query(collection(db, `artifacts/${appId}/users/${userId}/chats`)),
      (snapshot) => {
        const chatsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecentChats(chatsData);
      },
      (error) => {
        console.error("Error fetching chats:", error);
        showAlert("Failed to load chats.");
      }
    );

    const unsubscribeNotifications = onSnapshot(
      query(collection(db, `artifacts/${appId}/users/${userId}/notifications`)),
      (snapshot) => {
        const notificationsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(notificationsData);
      },
      (error) => {
        console.error("Error fetching notifications:", error);
        showAlert("Failed to load notifications.");
      }
    );

    return () => {
      unsubscribeGroups();
      unsubscribeChats();
      unsubscribeNotifications();
    };
  }, [isAuthReady, userId, db, appId]);

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col font-sans antialiased">
      <nav className="bg-[#1E1E1E] shadow-sm p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <span className="text-xl font-bold text-[#2DE1C8]">KUPals</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-300">Welcome, {userName}!</span>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-[#1E1E1E] shadow-md p-4 flex flex-col space-y-4 border-r border-[#2C2C2C]">
          <nav className="space-y-2">
            <Link
              href="dashboard"
              className="block px-3 py-2 bg-[#2C2C2C] text-[#2DE1C8] font-semibold rounded-md transition duration-150 ease-in-out"
            >
              Dashboard
            </Link>
            <Link
              href="group"
              className="block px-3 py-2 text-gray-300 hover:bg-[#2C2C2C] rounded-md transition duration-150 ease-in-out"
            >
              Groups
            </Link>
            <Link
              href="chat"
              className="block px-3 py-2 text-gray-300 hover:bg-[#2C2C2C] rounded-md transition duration-150 ease-in-out"
            >
              Chat
            </Link>
            <Link
              href={`/profile${user ? `/${user.uid}` : ""}`}
              className="block px-3 py-2 text-gray-300 hover:bg-[#2C2C2C] rounded-md transition duration-150 ease-in-out"
            >
              Profile
            </Link>
            <Link
              href="settings"
              className="block px-3 py-2 text-gray-300 hover:bg-[#2C2C2C] rounded-md transition duration-150 ease-in-out"
            >
              Settings
            </Link>
          </nav>
          {userId && (
            <div className="mt-auto p-3 bg-[#2C2C2C] rounded-lg text-sm text-gray-400 break-words">
              User ID: <br />{" "}
              <span className="font-mono text-xs">{userId}</span>
            </div>
          )}
        </aside>

        <main className="flex-1 p-6 overflow-y-auto bg-[#121212]">
          <h1 className="text-3xl font-bold text-gray-200 mb-8">
            Dashboard Overview
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#1E1E1E] rounded-lg shadow-xl p-6 border border-[#2C2C2C] transform hover:scale-105 transition-transform duration-300">
              <h2 className="text-xl font-semibold text-gray-300 mb-2">
                My Groups
              </h2>
              <p className="text-gray-100 text-4xl font-bold">
                {myGroups.length}
              </p>
            </div>
            <div className="bg-[#1E1E1E] rounded-lg shadow-xl p-6 border border-[#2C2C2C] transform hover:scale-105 transition-transform duration-300">
              <h2 className="text-xl font-semibold text-gray-300 mb-2">
                Unread Chats
              </h2>
              <p className="text-gray-100 text-4xl font-bold">
                {recentChats.length}
              </p>
            </div>
            <div className="bg-[#1E1E1E] rounded-lg shadow-xl p-6 border border-[#2C2C2C] transform hover:scale-105 transition-transform duration-300">
              <h2 className="text-xl font-semibold text-gray-300 mb-2">
                Notifications
              </h2>
              <p className="text-gray-100 text-4xl font-bold">
                {notifications.length}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#1E1E1E] rounded-lg shadow-xl p-6 border border-[#2C2C2C]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-200">
                  My Groups
                </h2>
                <button className="text-sm px-4 py-2 bg-[#2C2C2C] text-[#2DE1C8] rounded-md hover:bg-gray-600 transition">
                  Create Group
                </button>
              </div>
              {myGroups.length > 0 ? (
                <ul className="space-y-4">
                  {myGroups.map((group) => (
                    <Link href={`/group/${group.id}`}>
                      <li
                        key={group.id}
                        className="flex items-center space-x-4 p-4 bg-[#2C2C2C] rounded-lg hover:bg-[#2C2C2C]/75 transition-colors duration-200 cursor-pointer"
                      >
                        <div className="w-10 h-10 bg-[#2DE1C8] text-[#131C28] flex items-center justify-center rounded-full text-lg font-bold flex-shrink-0">
                          {group.name
                            ? group.name.charAt(0).toUpperCase()
                            : "G"}
                        </div>
                        <div className="flex-grow">
                          <p className="text-gray-200 font-medium text-lg">
                            {group.name || `Group ${group.id.substring(0, 5)}`}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {group.description || "No description provided."}
                          </p>
                        </div>
                        <span className="text-gray-500 text-sm">
                          ({group.type || "Public"})
                        </span>
                      </li>
                    </Link>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No groups found. Start by creating or joining one!
                </p>
              )}
            </div>

            <div className="bg-[#1E1E1E] rounded-lg shadow-xl p-6 border border-[#2C2C2C]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-200">
                  Recent Chats
                </h2>
                <button className="text-sm px-4 py-2 bg-[#2C2C2C] text-[#2DE1C8] rounded-md hover:bg-gray-600 transition">
                  New Chat
                </button>
              </div>
              {recentChats.length > 0 ? (
                <ul className="space-y-4">
                  {recentChats.map((chat) => (
                    <li
                      key={chat.id}
                      className="p-4 bg-[#2C2C2C] rounded-lg hover:bg-[#2C2C2C]/75 transition-colors duration-200 cursor-pointer"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-[#2DE1C8] text-[#131C28] flex items-center justify-center rounded-full text-lg font-bold flex-shrink-0">
                          {chat.senderId
                            ? chat.senderId.charAt(0).toUpperCase()
                            : "U"}
                        </div>
                        <div className="flex-grow">
                          <p className="font-medium text-gray-200 text-lg">
                            {chat.senderId
                              ? `User ${chat.senderId.substring(0, 8)}`
                              : "Unknown User"}
                          </p>
                          <p className="text-gray-400 text-sm mt-1 truncate">
                            {chat.message}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 block mt-2">
                        {chat.timestamp
                          ? new Date(
                              chat.timestamp.seconds * 1000
                            ).toLocaleString()
                          : "Just now"}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No recent chats. Start a conversation!
                </p>
              )}
            </div>

            <div className="bg-[#1E1E1E] rounded-lg shadow-xl p-6 border border-[#2C2C2C] lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-200">
                  Notifications
                </h2>
                <button className="text-sm px-4 py-2 bg-[#2C2C2C] text-[#2DE1C8] rounded-md hover:bg-gray-600 transition">
                  Mark all as read
                </button>
              </div>
              {notifications.length > 0 ? (
                <ul className="space-y-4">
                  {notifications.map((notification) => (
                    <li
                      key={notification.id}
                      className="p-4 bg-[#2C2C2C] rounded-lg hover:bg-[#2C2C2C]/75 transition-colors duration-200 cursor-pointer"
                    >
                      <p className="font-medium text-gray-200">
                        {notification.title || "New Notification"}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        {notification.message || "You have a new update."}
                      </p>
                      {notification.timestamp && (
                        <span className="text-xs text-gray-500 block mt-2">
                          {new Date(
                            notification.timestamp.seconds * 1000
                          ).toLocaleString()}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No new notifications.
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default KUPalsDashboard;
