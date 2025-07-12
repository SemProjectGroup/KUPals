"use client";

import UserProfile from "../../../components/profile/userProfile";
import { use } from "react";

export default function ProfilePage({ params }) {
  const { slug } = use(params);

  return (
    <>
      <UserProfile />
    </>
  );
}
