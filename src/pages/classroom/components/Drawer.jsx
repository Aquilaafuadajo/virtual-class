import React, { useState } from "react";
import { connect } from "react-redux";

import { push } from "firebase/database";

import {
  addMessage,
  updateParticipant as updatePcpnt,
} from "../../../store/actioncreator";

import formatAMPM from "../../../utils/formatDate";

// icons
import { ReactComponent as CancelIcon } from "../../../assets/icons/cancel.svg";
import { ReactComponent as SendIcon } from "../../../assets/icons/Send.svg";
import { ReactComponent as MicIcon } from "../../../assets/icons/mic.svg";
import { ReactComponent as MicStrikeIcon } from "../../../assets/icons/mic_strike.svg";

const Drawer = ({
  drawerContent,
  onCloseDrawer,
  participants,
  updateParticipant,
  classroomInfo,
  messagesRef,
  messages,
  addMessage,
  user,
}) => {
  const ParticipantsUI = () => {
    const onMicClick = (key, participant) => {
      updateParticipant({
        [key]: {
          audio: !participant.audio,
        },
      });
    };
    console.log(user);
    return (
      <div className="flex flex-col rounded-2xl h-[80vh] w-[90vw] lg:w-[35vw] bg-white ml-auto mr-5 p-8 relative">
        <div className="flex justify-between items-center h-max w-full mb-5">
          <h3 className="font-semibold text-xl lg:text-2xl text[#282828]">
            People
          </h3>
          <button onClick={onCloseDrawer} className="p-3">
            <CancelIcon className="w-5 h-5" />
          </button>
        </div>
        <p className="text-lg text-[#828282] font-bold mb-5">In call</p>
        {Object.keys(participants ? participants : {}).map((key) => (
          <div key={key} className="flex justify-between items-center mb-3">
            <div className="flex flex-col text-[#333333]">
              <p className="text-sm">
                {participants[key].userName} {user[key] ? "(You)" : null}
              </p>
              {/* <p className="text-sm">Meeting host</p> */}
            </div>
            <button
              onClick={() => onMicClick(key, participants[key])}
              className="p-3"
              disabled={
                user && Object.values(user)[0]?.userId === classroomInfo.ownerId
                  ? false
                  : true
              }
            >
              {participants[key].audio ? (
                <MicIcon className="drawer-mic" />
              ) : (
                <MicStrikeIcon className="drawer-mic-strike" />
              )}
            </button>
          </div>
        ))}
      </div>
    );
  };
  const ChatUI = () => {
    const [message, setMessage] = useState("");
    const sendMessage = () => {
      if (!message.trim().length) {
        return;
      }
      const messageDetails = {
        message,
        time: formatAMPM(new Date()),
        username: Object.values(user)[0]?.userName,
      };
      const newMessageRef = push(messagesRef, messageDetails);
      addMessage({
        [newMessageRef.key]: messageDetails,
      });
    };
    return (
      <div className="flex flex-col rounded-2xl h-[80vh] w-[90vw] lg:w-[35vw] bg-white ml-auto mr-5 p-8 relative">
        <div className="flex justify-between items-center h-max w-full mb-5">
          <h3 className="font-semibold text-xl lg:text-2xl text[#282828]">
            In-call Messages
          </h3>
          <button onClick={onCloseDrawer} className="p-3">
            <CancelIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 rounded-2xl bg-[#EDF2F7] mb-6">
          <p className="text-base text-[#4F4F4F] text-center">
            Messages can only be seen by people in the call and are deleted when
            the call ends
          </p>
        </div>
        <div className="flex flex-col w-full overflow-y-scroll drawer-scroll-area">
          {Object.keys(messages ? messages : {}).map((key) => (
            <div key={key} className="flex flex-col mb-3">
              <p className="text-sm text[#282828] mb-1">
                <span className="font-bold mr-3">{messages[key].username}</span>
                <span>{messages[key].time}</span>
              </p>
              <p className="text-sm text-[#282828]">{messages[key].message}</p>
            </div>
          ))}
        </div>
        <div className="flex bg-[#EDF2F7] rounded-3xl border overflow-hidden px-4 py-3 mt-auto">
          <input
            placeholder="Send a message to everyone"
            type="text"
            className="w-full bg-inherit focus:outline-none"
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>
            <SendIcon />
          </button>
        </div>
      </div>
    );
  };
  return drawerContent === "chat" ? <ChatUI /> : <ParticipantsUI />;
};

const mapStateToProps = (state) => {
  return {
    user: state.currentUser,
    participants: state.participants,
    classroomInfo: state.classroomInfo,
    messages: state.messages,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateParticipant: (info) => dispatch(updatePcpnt(info)),
    addMessage: (msg) => dispatch(addMessage(msg)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Drawer);
