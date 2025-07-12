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
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "@/utils/firebase";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null); // State for current user's profile

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Fetch current user's profile if user is logged in
        const userProfile = await _fetchUserProfile(firebaseUser.uid); // Use internal fetch
        setProfile(userProfile);
      } else {
        setProfile(null); // Clear profile if logged out
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- Internal Firestore Profile Fetch Function ---
  // Renamed to _fetchUserProfile to distinguish from the public getUserProfile
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

  // Function to create/set user profile in Firestore
  const setUserProfile = async (uid, data) => {
    const userDocRef = doc(db, "users", uid);
    await setDoc(
      userDocRef,
      { ...data, lastUpdated: new Date() },
      { merge: true }
    );
    // After updating, refetch the current user's profile to keep context in sync
    if (user && user.uid === uid) {
      // Only update if it's the current user's profile
      setProfile(await _fetchUserProfile(uid));
    }
  };

  // Function to upload avatar to Firebase Storage
  const uploadAvatar = async (uid, file) => {
    if (!uid || !file) return null;

    const avatarRef = ref(storage, `avatars/${uid}/${file.name}`);
    const snapshot = await uploadBytes(avatarRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  // --- Authentication Functions (Modified) ---

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

      const existingProfile = await _fetchUserProfile(user.uid); // Use internal fetch
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

  const contextValue = {
    user,
    loading,
    profile, // Current user's profile
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    updateUserProfile: setUserProfile,
    uploadAvatar,
    getUserProfile: _fetchUserProfile, // Expose the function to fetch ANY user profile
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
