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
  addDoc,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";

const KUPalsGroupsPage = () => {
  const [userId, setUserId] = useState(null);
  const [groups, setGroups] = useState([]);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [joinGroupId, setJoinGroupId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const [userName, setUserName] = useState("User");

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
        setUserId(user.uid);
        setUserName(user.displayName || user.email || "User");
        setIsAuthReady(true);
      } else {
        setUserId(null);
        setIsAuthReady(true);
        setGroups([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, [auth]);

  useEffect(() => {
    if (!isAuthReady || !userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const userGroupsRef = collection(
      db,
      `artifacts/${appId}/users/${userId}/groups`
    );
    const unsubscribe = onSnapshot(
      userGroupsRef,
      async (snapshot) => {
        const userGroupRefs = snapshot.docs.map((d) => d.data().groupRef.id);
        if (userGroupRefs.length === 0) {
          setGroups([]);
          setLoading(false);
          return;
        }

        try {
          const publicGroupsCollection = collection(
            db,
            `artifacts/${appId}/public/data/groups`
          );
          const groupPromises = userGroupRefs.map((id) =>
            getDoc(doc(publicGroupsCollection, id))
          );
          const groupSnapshots = await Promise.all(groupPromises);
          const groupsData = groupSnapshots.map((d) => ({
            id: d.id,
            ...d.data(),
          }));
          setGroups(groupsData);
        } catch (err) {
          console.error("Error fetching group details:", err);
          setError("Failed to load group details.");
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching user groups:", err);
        setError("Failed to load your groups. Please try again later.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isAuthReady, userId, db, appId]);

  const handleCreateGroup = async () => {
    if (newGroupName.trim() === "") {
      setModalMessage("Group name cannot be empty.");
      return;
    }
    setModalMessage("");

    try {
      const publicGroupsCollection = collection(
        db,
        `artifacts/${appId}/public/data/groups`
      );
      const newGroupDocRef = await addDoc(publicGroupsCollection, {
        name: newGroupName,
        description: newGroupDescription,
        createdAt: serverTimestamp(),
        createdBy: userId,
      });

      const chatCollectionRef = collection(
        db,
        `artifacts/${appId}/public/data/groups/${newGroupDocRef.id}/chats`
      );
      await addDoc(chatCollectionRef, {
        text: `${userName} created the group!`,
        createdAt: serverTimestamp(),
        userId: "system",
      });

      const userGroupsCollection = collection(
        db,
        `artifacts/${appId}/users/${userId}/groups`
      );
      await setDoc(doc(userGroupsCollection, newGroupDocRef.id), {
        groupRef: newGroupDocRef,
        joinedAt: serverTimestamp(),
      });

      setNewGroupName("");
      setNewGroupDescription("");
      setShowModal(false);
    } catch (err) {
      console.error("Error creating group:", err);
      setModalMessage("Failed to create group. Please try again.");
    }
  };

  const handleJoinGroup = async () => {
    if (joinGroupId.trim() === "") {
      setModalMessage("Group ID cannot be empty.");
      return;
    }
    setModalMessage("");

    try {
      const publicGroupRef = doc(
        db,
        `artifacts/${appId}/public/data/groups`,
        joinGroupId
      );
      const publicGroupSnap = await getDoc(publicGroupRef);

      if (!publicGroupSnap.exists()) {
        setModalMessage("Group with that ID does not exist.");
        return;
      }

      const userGroupsCollection = collection(
        db,
        `artifacts/${appId}/users/${userId}/groups`
      );
      const userGroupDocRef = doc(userGroupsCollection, joinGroupId);
      const userGroupSnap = await getDoc(userGroupDocRef);

      if (userGroupSnap.exists()) {
        setModalMessage("You are already a member of this group.");
        return;
      }

      await setDoc(userGroupDocRef, {
        groupRef: publicGroupRef,
        joinedAt: serverTimestamp(),
      });

      setJoinGroupId("");
      setShowModal(false);
    } catch (err) {
      console.error("Error joining group:", err);
      setModalMessage("Failed to join group. Please try again.");
    }
  };

  const GroupCard = ({ id, name, description }) => (
    <Link href={`/group/${id}`} className="block">
      <div className="bg-[#252F2D]/70 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-[#3A3A4D]/50 flex flex-col space-y-4 hover:bg-[#252F2D]/90 transition-colors duration-200 cursor-pointer">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-[#2ACAA8]/20 text-[#2ACAA8] flex items-center justify-center rounded-full text-2xl font-bold flex-shrink-0 border border-[#2ACAA8]/50">
            {name ? name.charAt(0).toUpperCase() : "G"}
          </div>
          <div className="flex-grow">
            <p className="text-white font-semibold text-xl">
              {name || "Unnamed Group"}
            </p>
            <p className="text-gray-300 text-sm mt-1 truncate">
              {description || "No description provided."}
            </p>
          </div>
        </div>
        <div className="text-xs text-gray-400 break-all">
          Group ID: <span className="font-mono text-gray-300">{id}</span>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen font-sans antialiased text-white bg-[#1A1A1A]">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7fe0e0]/20 to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-[#2ACAA8]/20 to-transparent pointer-events-none"></div>
      </div>
      <nav className="relative z-10 bg-[#252F2D]/70 backdrop-blur-lg shadow-sm p-4 flex items-center justify-between sticky top-0 border-b border-[#3A3A4D]/50">
        <div className="flex items-center">
          <span className="text-xl font-bold text-white">KUPals</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="#"
            className="px-3 py-2 text-gray-300 hover:text-white transition-colors duration-150 ease-in-out"
          >
            Dashboard
          </Link>
          <button
            className="text-sm px-4 py-2 bg-[#2ACAA8] text-white rounded-lg font-semibold hover:bg-[#23A891] transition"
            onClick={() => {
              setShowModal(true);
              setModalMode("create");
            }}
          >
            Create Group
          </button>
          <button
            className="text-sm px-4 py-2 bg-[#2ACAA8] text-white rounded-lg font-semibold hover:bg-[#23A891] transition"
            onClick={() => {
              setShowModal(true);
              setModalMode("join");
            }}
          >
            Join Group
          </button>
        </div>
      </nav>

      <main className="relative flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-200 mb-8 mt-4">
          My Groups
        </h1>

        {loading ? (
          <div className="text-gray-400 text-center py-10">
            Loading groups...
          </div>
        ) : error ? (
          <div className="text-red-400 text-center py-10">{error}</div>
        ) : groups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <GroupCard
                key={group.id}
                id={group.id}
                name={group.name}
                description={group.description}
              />
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-center py-10">
            <p className="text-lg">You are not a member of any groups yet.</p>
            <p className="mt-2">
              Click "Create Group" to start a new one or "Join Group" to join an
              existing one.
            </p>
            <div className="mt-6 flex justify-center space-x-4">
              <button
                className="py-3 px-8 bg-[#2ACAA8] text-white font-semibold rounded-lg hover:bg-[#23A891] transition duration-300"
                onClick={() => {
                  setShowModal(true);
                  setModalMode("create");
                }}
              >
                Create Group
              </button>
              <button
                className="py-3 px-8 bg-[#2ACAA8] text-white font-semibold rounded-lg hover:bg-[#23A891] transition duration-300"
                onClick={() => {
                  setShowModal(true);
                  setModalMode("join");
                }}
              >
                Join Group
              </button>
            </div>
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-[#1A1A1A]/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#252F2D]/70 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md border border-[#3A3A4D]/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#2ACAA8]">
                {modalMode === "create" ? "Create a New Group" : "Join a Group"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                &times;
              </button>
            </div>
            {modalMessage && (
              <div className="bg-red-900 text-red-300 p-3 rounded-md mb-4">
                {modalMessage}
              </div>
            )}
            {modalMode === "create" ? (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="newGroupName"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Group Name
                  </label>
                  <input
                    type="text"
                    id="newGroupName"
                    placeholder="Group Name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="w-full p-3 bg-[#354240] border border-[#455553] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] shadow-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="newGroupDescription"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Description (Optional)
                  </label>
                  <textarea
                    id="newGroupDescription"
                    placeholder="Group Description (Optional)"
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                    className="w-full p-3 bg-[#354240] border border-[#455553] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] shadow-sm resize-y"
                    rows="3"
                  ></textarea>
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleCreateGroup}
                    className="py-3 px-8 bg-[#2ACAA8] text-white font-semibold rounded-lg hover:bg-[#23A891] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!newGroupName.trim()}
                  >
                    Create Group
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="joinGroupId"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Group ID
                  </label>
                  <input
                    type="text"
                    id="joinGroupId"
                    placeholder="Enter Group ID"
                    value={joinGroupId}
                    onChange={(e) => setJoinGroupId(e.target.value)}
                    className="w-full p-3 bg-[#354240] border border-[#455553] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3CE6BD] shadow-sm"
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleJoinGroup}
                    className="py-3 px-8 bg-[#2ACAA8] text-white font-semibold rounded-lg hover:bg-[#23A891] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!joinGroupId.trim()}
                  >
                    Join Group
                  </button>
                </div>
              </div>
            )}
            <div className="mt-6 text-center border-t border-[#3A3A4D]/50 pt-4">
              <button
                onClick={() =>
                  setModalMode(modalMode === "create" ? "join" : "create")
                }
                className="text-[#2ACAA8] hover:underline"
              >
                {modalMode === "create"
                  ? "Already have a Group ID? Join one."
                  : "Want to create a new group?"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KUPalsGroupsPage;
