import React from "react";

import DetailedProfile from "@/components/profile/detailedProfile";
import { Link } from "lucide-react";

const page = () => {
  return (
    <>
      <Link href="/">Back to Home</Link>
      <DetailedProfile />
    </>
  );
};

export default page;
