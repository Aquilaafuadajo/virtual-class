import React from "react";

const MainScreen = ({ videoRef, showAvatar, currentUser }) => {
  return !showAvatar ? (
    <video
      ref={videoRef}
      className="w-full h-full video"
      autoPlay
      playsInline
    ></video>
  ) : (
    <div className="flex justify-center items-center w-[180px] h-[180px] bg-green-500 rounded-full mb-[100px]">
      <h1 className="font-normal text-[100px] text-white capitalize">
        {currentUser?.userName[0]}
      </h1>
    </div>
  );
};

export default MainScreen;
