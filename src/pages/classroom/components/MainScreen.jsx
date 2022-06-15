import React from "react";
import { connect } from "react-redux";

const MainScreen = ({
  videoRef,
  showAvatar,
  currentUser,
  participants,
  classroomInfo,
  sharing,
}) => {
  const participantKey = Object.keys(participants);

  const participantsList = participantKey.map((element, index) => {
    const currentParticipant = participants[element];
    const isCurrentUser = currentParticipant.currentUser;
    const isOwner = participants[element].userId === classroomInfo.ownerId;
    if (isCurrentUser || isOwner) {
      return null;
    }
    const pc = currentParticipant.peerConnection;
    const remoteStream = new MediaStream();
    let curentIndex = index;
    if (pc) {
      pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
        const videElement = document.getElementById(
          `participantVideo${curentIndex}`
        );
        if (videElement) videElement.srcObject = remoteStream;
      };
    }

    return (
      <video
        key={curentIndex}
        id={`participantVideo${curentIndex}`}
        className="participant-video"
        autoPlay
        playsInline
      ></video>
    );
  });
  return (
    <div className="flex justify-center items-center w-[180px] h-[180px] bg-green-500 rounded-full mb-[100px]">
      <video
        ref={videoRef}
        className={`video ${!showAvatar ? "" : "hide-video"} ${
          sharing && "no-scale"
        }`}
        autoPlay
        playsInline
      ></video>
      {participantsList}
      <h1 className="font-normal text-[100px] text-white capitalize">
        {currentUser?.userName[0]}
      </h1>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    participants: state.participants,
    classroomInfo: state.classroomInfo,
    stream: state.mainStream,
  };
};

export default connect(mapStateToProps)(MainScreen);
// export default MainScreen;
