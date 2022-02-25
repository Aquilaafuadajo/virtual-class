import React from "react";
import { connect } from "react-redux";

// icons
import { ReactComponent as CancelIcon } from "../../../assets/icons/cancel.svg";
import { ReactComponent as SendIcon } from "../../../assets/icons/Send.svg";
import { ReactComponent as MicIcon } from "../../../assets/icons/mic.svg";
import { ReactComponent as MicStrikeIcon } from "../../../assets/icons/mic_strike.svg";

const Drawer = ({
  drawerContent,
  onCloseDrawer,
  participants,
  chatList,
  onSend,
}) => {
  const ParticipantsUI = () => {
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
        <div className="flex justify-between items-center mb-3">
          <div className="flex flex-col text-[#333333]">
            <p className="text-sm">Emmanuel Afuadajo (You)</p>
            <p className="text-sm">Meeting host</p>
          </div>
          <button className="p-3">
            <MicIcon className="drawer-mic" />
          </button>
        </div>
        {Object.keys(participants ? participants : {}).map((key) => (
          <p key={key}>{key}</p>
        ))}
        <div className="flex justify-between items-center mb-3">
          <div className="flex flex-col text-[#333333]">
            <p className="text-sm">Emmanuel Afuadajo (You)</p>
            <p className="text-sm">Meeting host</p>
          </div>
          <button className="p-3">
            <MicIcon className="drawer-mic" />
          </button>
        </div>
      </div>
    );
  };
  const ChatUI = () => {
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
          <div className="flex flex-col mb-3">
            <p className="text-sm text[#282828] mb-3">
              <span className="font-bold mr-3">You</span>
              <span>10:55 PM</span>
            </p>
            <p className="text-sm text-[#282828]">Hello everyone</p>
          </div>
        </div>
        <div className="flex bg-[#EDF2F7] rounded-3xl border overflow-hidden px-4 py-3 mt-auto">
          <input
            placeholder="Send a message to everyone"
            type="text"
            className="w-full bg-inherit focus:outline-none"
          />
          <button>
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
    participants: state.participants,
  };
};

// const mapDispatchToProps = (dispatch) => {
//   return {
//     setMainStream: (stream) => dispatch(setMainStream(stream)),
//     addParticipant: (user) => dispatch(addParticipant(user)),
//     setUser: (user) => dispatch(setUser(user)),
//     removeParticipant: (userId) => dispatch(removeParticipant(userId)),
//     updateParticipant: (user) => dispatch(updateParticipant(user)),
//     setClassroomInfo: (info) => dispatch(setClassroomInfo(info)),
//   };
// };

export default connect(mapStateToProps)(Drawer);
