import React from "react";

import Button from "../ui/button";
import Link from "next/link";

const LeftColumn = () => {
  return (
    <div className="relative w-full md:w-2/5 flex flex-col justify-between p-6 md:p-6 lg:p-6 text-white overflow-hidden rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
      {/* <Image
        src={0} // Path to your background image in public folder
        alt="Kupals"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="z-0 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none" // Apply rounded corners to the image as well
      /> */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"></div>

      <div className="relative z-20 flex justify-between items-start w-full">
        <Link href="/">
          <Button className="py-2 px-6 bg-[#2ACAA8] text-white text-sm font-medium rounded-full hover:bg-[#23A891] transition duration-300 ease-in-out shadow-md">
            Back to website
          </Button>
        </Link>
      </div>

      <div className="relative z-20 text-center mb-4 md:mb-0">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight drop-shadow-lg [text-shadow:0_0_8px_rgba(0,0,0,0.8)]">
          Making Plans,
          <br /> Capturing Memories
        </h1>
      </div>
    </div>
  );
};

export default LeftColumn;
