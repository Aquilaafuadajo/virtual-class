import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

// components
import ControlButton from "./ControlButton";

// icons
import { ReactComponent as MicIcon } from "../../../assets/icons/mic.svg";
import { ReactComponent as MicStrikeIcon } from "../../../assets/icons/mic_strike.svg";
import { ReactComponent as VideoIcon } from "../../../assets/icons/video.svg";
import { ReactComponent as VideoStrikeIcon } from "../../../assets/icons/video_strike.svg";
import { ReactComponent as RecordIcon } from "../../../assets/icons/record.svg";
import { ReactComponent as ShareScreenIcon } from "../../../assets/icons/share_screen.svg";
import { ReactComponent as HangupIcon } from "../../../assets/icons/hang_up.svg";

// import '../index.css'

const Drawer = (props) => {
  const [streamState, setStreamState] = useState({
    mic: true,
    video: false,
    screen: false,
    recording: false,
  });
  const micClick = () => {
    props.onMicClick(!Object.values(props.user)[0].audio);
    // setStreamState((currentState) => {
    //   return {
    //     ...currentState,
    //     mic: !currentState.mic,
    //   };
    // });
  };

  const onVideoClick = () => {
    props.onVideoClick(!Object.values(props.user)[0].video);
    // setStreamState((currentState) => {
    //   return {
    //     ...currentState,
    //     video: !currentState.video,
    //   };
    // });
  };

  const onScreenClick = () => {
    props.onScreenClick(!Object.values(props.user)[0].screen);
    // props.onScreenClick(setScreenState);
  };

  const setScreenState = (isEnabled) => {
    // setStreamState((currentState) => {
    //   return {
    //     ...currentState,
    //     screen: isEnabled,
    //   };
    // });
  };
  // useEffect(() => {
  //   props.onMicClick(streamState.mic);
  // }, [streamState.mic]);
  // useEffect(() => {
  //   props.onVideoClick(streamState.video);
  // }, [streamState.video]);

  return (
    <div className="bg-white w-full flex justify-center items-center p-3">
      {props.isTeacher ? (
        <div className="flex">
          {/* <ControlButton
            icon={<RecordIcon />}
            onClick={() => toggleRecording()}
            activeClass={streamState.recording ? "active" : ""}
          /> */}
          <ControlButton
            icon={
              props.user && Object.values(props.user)[0].audio ? (
                <MicIcon />
              ) : (
                <MicStrikeIcon />
              )
            }
            onClick={micClick}
            activeClass={
              props.user && Object.values(props.user)[0].audio ? "" : "active"
            }
            disabled={false}
          />
          <ControlButton
            icon={
              props.user && Object.values(props.user)[0].video ? (
                <VideoIcon />
              ) : (
                <VideoStrikeIcon />
              )
            }
            onClick={onVideoClick}
            activeClass={
              props.user && Object.values(props.user)[0].video ? "" : "active"
            }
            disabled={props.user && Object.values(props.user)[0].screen}
          />
          <ControlButton
            icon={<ShareScreenIcon />}
            onClick={onScreenClick}
            activeClass={
              props.user && Object.values(props.user)[0].screen ? "" : "active"
            }
          />
          <button className="bg-[#EB5757] px-3 rounded-3xl mx-3">
            <HangupIcon />
          </button>
        </div>
      ) : (
        <div className="flex">
          <ControlButton
            icon={!streamState.mic ? <MicIcon /> : <MicStrikeIcon />}
            onClick={micClick}
            activeClass={streamState.mic ? "" : "active"}
            disabled={true}
          />
          <button className="bg-[#EB5757] px-3 rounded-3xl mx-3">
            <HangupIcon />
          </button>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    participants: state.participants,
    user: state.currentUser,
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
