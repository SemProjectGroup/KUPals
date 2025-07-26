"use client";

import { useState, useEffect, createContext, useContext } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "@/utils/firebase";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userProfile = await _fetchUserProfile(firebaseUser.uid);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const _fetchUserProfile = async (uid) => {
    if (!uid) return null;
    const userDocRef = doc(db, "users", uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such user profile document!");
      return null;
    }
  };

  const setUserProfile = async (uid, data) => {
    const userDocRef = doc(db, "users", uid);
    await setDoc(
      userDocRef,
      { ...data, lastUpdated: new Date() },
      { merge: true }
    );
    if (user && user.uid === uid) {
      setProfile(await _fetchUserProfile(uid));
    }
  };

  const uploadAvatar = async (uid, file) => {
    if (!uid || !file) return null;
    const avatarRef = ref(storage, `avatars/${uid}/${file.name}`);
    const snapshot = await uploadBytes(avatarRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  const signUp = async (email, password, firstName, lastName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setUserProfile(user.uid, {
        firstName: firstName,
        lastName: lastName,
        email: user.email,
        bio: "",
        hobbies: [],
        groups: [],
        socials: {},
        department: "",
        semester: "",
        createdAt: new Date(),
      });

      return userCredential;
    } catch (error) {
      throw error;
    }
  };

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const existingProfile = await _fetchUserProfile(user.uid);
      if (!existingProfile) {
        await setUserProfile(user.uid, {
          firstName: user.displayName ? user.displayName.split(" ")[0] : "",
          lastName: user.displayName
            ? user.displayName.split(" ").slice(1).join(" ")
            : "",
          email: user.email,
          avatarUrl: user.photoURL || "",
          bio: "",
          hobbies: [],
          groups: [],
          socials: {},
          department: "",
          semester: "",
          createdAt: new Date(),
        });
      }

      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    return signOut(auth);
  };

  const sendMessage = async (messageText) => {
    if (!user || !messageText.trim()) {
      console.warn("Cannot send empty message or if not authenticated.");
      return;
    }

    try {
      await addDoc(collection(db, "universal_messages"), {
        uid: user.uid,
        userName: profile
          ? `${profile.firstName} ${profile.lastName}`.trim()
          : user.email,
        userAvatar: profile ? profile.avatarUrl : null,
        text: messageText,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Error sending message:", error);
      throw new Error("Failed to send message.");
    }
  };

  const getUniversalMessages = (callback) => {
    const messagesRef = collection(db, "universal_messages");

    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(messages);
      },
      (error) => {
        console.error("Error listening to messages:", error);
      }
    );

    return unsubscribe;
  };

  const contextValue = {
    user,
    loading,
    profile,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    updateUserProfile: setUserProfile,
    uploadAvatar,
    getUserProfile: _fetchUserProfile,
    sendMessage,
    getUniversalMessages,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
