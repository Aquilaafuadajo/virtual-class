import React from "react";

const MainScreen = ({ videoRef, showAvatar, currentUser }) => {
  return (
    <div className="flex justify-center items-center w-[180px] h-[180px] bg-green-500 rounded-full mb-[100px]">
      <video
        ref={videoRef}
        className={`video ${!showAvatar ? "" : "hide-video"}`}
        autoPlay
        playsInline
      ></video>
      <h1 className="font-normal text-[100px] text-white capitalize">
        {currentUser?.userName[0]}
      </h1>
    </div>
  );
};

export default MainScreen;
