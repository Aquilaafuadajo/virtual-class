import React, { useState } from "react";

// components
import Drawer from "./components/Drawer";
import ControlButton from "./components/ControlButton";

// icons
import { ReactComponent as MicIcon } from "../../assets/icons/mic.svg";
import { ReactComponent as MicStrikeIcon } from "../../assets/icons/mic_strike.svg";
import { ReactComponent as VideoIcon } from "../../assets/icons/video.svg";
import { ReactComponent as VideoStrikeIcon } from "../../assets/icons/video_strike.svg";
import { ReactComponent as RecordIcon } from "../../assets/icons/record.svg";
import { ReactComponent as ShareScreenIcon } from "../../assets/icons/share_screen.svg";
import { ReactComponent as HangupIcon } from "../../assets/icons/hang_up.svg";
import { ReactComponent as UsersIcon } from "../../assets/icons/users.svg";
import { ReactComponent as ChatIcon } from "../../assets/icons/chat.svg";

import "./index.css";

function Classroom() {
  // get user from local storage / app context
  // if user is teacher, present teacher controls else present student controls
  const [isRecording, setIsRecording] = useState(false);
  const toggleRecording = () => {
    if (!isRecording) {
      // start recording
      setIsRecording(true);
    } else {
      // stop recording
      setIsRecording(false);
    }
  };

  const [muted, setMuted] = useState(false);
  const toggleMuted = () => {
    if (!muted) {
      // start transmitting
      setMuted(true);
    } else {
      // stop recording
      setMuted(false);
    }
  };

  const [isVideoOn, setIsVideoOn] = useState(false);
  const toggleVideo = () => {
    if (!isVideoOn) {
      // start transmitting
      setIsVideoOn(true);
    } else {
      // stop recording
      setIsVideoOn(false);
    }
  };

  const [sharingScreen, setSharingScreen] = useState(false);
  const toggleShareScreen = () => {
    if (!sharingScreen) {
      // start transmitting
      setSharingScreen(true);
    } else {
      // stop recording
      setSharingScreen(false);
    }
  };

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState("");
  const presentChatUI = () => {
    setDrawerOpen(true);
    setDrawerContent("chat");
  };
  const presentParticipantsUI = () => {
    setDrawerOpen(true);
    setDrawerContent("participants");
  };
  const closeDrawer = () => {
    setDrawerOpen(false);
    setDrawerContent("");
  };

  return (
    <div className="w-screen h-screen bg-[#282828] relative flex justify-center items-center">
      <div className="flex justify-center items-center w-[180px] h-[180px] bg-green-500 rounded-full mb-[100px]">
        <h1 className="font-normal text-[100px] text-white">A</h1>
      </div>
      <div className="absolute bottom-0 right-0 left-0 flex flex-col">
        {drawerOpen && (
          <Drawer
            drawerContent={drawerContent}
            onCloseDrawer={() => closeDrawer()}
          />
        )}
        <div className="flex justify-between px-3">
          <div className="flex flex-col">
            <p className="text-white text-lg font-bold">You</p>
            <p className="text-white text-lg font-bold mb-2">11: 59 PM</p>
          </div>
          <div className="flex">
            <button onClick={() => presentParticipantsUI()} className="mx-4">
              <UsersIcon
                className={`${
                  drawerContent === "participants" ? "icon-active" : ""
                }`}
              />
            </button>
            <button onClick={() => presentChatUI()} className="ml-4">
              <ChatIcon
                className={`${drawerContent === "chat" ? "icon-active" : ""}`}
              />
            </button>
          </div>
        </div>
        <div className="bg-white w-full flex justify-center items-center p-3">
          <div className="flex">
            <ControlButton
              icon={<RecordIcon />}
              onClick={() => toggleRecording()}
              activeClass={isRecording ? "active" : ""}
            />
            <ControlButton
              icon={!muted ? <MicIcon /> : <MicStrikeIcon />}
              onClick={() => toggleMuted()}
              activeClass={muted ? "active" : ""}
              disabled={false}
            />
            <ControlButton
              icon={!isVideoOn ? <VideoIcon /> : <VideoStrikeIcon />}
              onClick={() => toggleVideo()}
              activeClass={isVideoOn ? "active" : ""}
              disabled={false}
            />
            <ControlButton
              icon={<ShareScreenIcon />}
              onClick={() => toggleShareScreen()}
              activeClass={sharingScreen ? "active" : ""}
              disabled={false}
            />
            <button className="bg-[#EB5757] px-3 rounded-3xl mx-3">
              <HangupIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Classroom;
