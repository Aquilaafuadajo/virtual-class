import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

// redux
import {
  setMainStream,
  addParticipant,
  setUser,
  setClassroomInfo,
  removeParticipant,
  updateParticipant,
} from "../../store/actioncreator";
import { connect } from "react-redux";

// firebase
import {
  getDatabase,
  child,
  push,
  ref,
  set,
  update,
  query,
  orderByChild,
  equalTo,
  onValue,
  onDisconnect,
  onChildChanged,
  onChildAdded,
  onChildRemoved,
  get,
} from "firebase/database";
import {
  db,
  classroomRef,
  connectedRef,
  getClassroomInfo,
  getClassroomParticipants,
} from "../../service/firebase";
import { addConnection } from "../../service/peerConnection";

// components
import Drawer from "./components/Drawer";
import ControlButton from "./components/ControlButton";

// context
import AppContext from "../../contexts/AppContext";
import ClassroomContext from "../../contexts/ClassroomContext";

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

function Classroom(props) {
  const history = useHistory();
  const { user } = useContext(AppContext);
  useEffect(() => {
    if (!user) {
      history.push("/login");
    }
  }, []);
  const isTeacher = user.role === "teacher";

  const getUserStream = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: isTeacher,
    });

    return localStream;
  };

  const participantRef = ref(
    db,
    `classrooms/${props.match.params.id}/participants`
  );
  useEffect(() => {
    async function initializeApp() {
      // get classroom metadata and store in state then display metadata info in ui
      localStorage.setItem("classroomKey", props.match.params.id);
      await getClassroomInfo(
        { classroomKey: props.match.params.id },
        async (data) => {
          props.setClassroomInfo(data);
          const stream = await getUserStream();
          if (isTeacher) {
            stream.getVideoTracks()[0].enabled = false;
            stream.getAudioTracks()[0].enabled = true;
          } else {
            stream.getAudioTracks()[0].enabled = false;
          }
          props.setMainStream(stream);
          onValue(connectedRef, (snap) => {
            if (snap.val()) {
              const participantInfo = {
                userId: user.userId,
                userName: user.fullname,
                preference: {
                  audio: isTeacher,
                  video: false,
                  screen: false,
                },
              };
              const currentParticipantRef = push(
                participantRef,
                participantInfo
              );
              // if teacher, end lecture and delete room else just remove student from participants
              props.setUser({
                [currentParticipantRef.key]: { ...participantInfo },
              });
              onDisconnect(currentParticipantRef).remove();
            }
          });
        },
        (error) => {
          history.push(`/app/${user.userId}`);
          alert(error);
        }
      );
    }
    initializeApp();
  }, []);

  const isLocalParticipantSet = !!props.user;
  const isStreamSet = !!props.stream;

  useEffect(() => {
    if (isLocalParticipantSet && isStreamSet) {
      onChildAdded(participantRef, async (snap) => {
        if (snap.exists()) {
          // console.log({ participants: snap.val() });
          const preferenceRef = child(participantRef, `${snap.key}/preference`);
          onChildChanged(preferenceRef, (snapshot) => {
            props.updateParticipant({
              [snap.key]: {
                [preferenceRef.key]: snapshot.val(),
              },
            });
          });

          props.addParticipant({
            [snap.key]: {
              ...snap.val(),
            },
          });
        }
      });
      onChildRemoved(participantRef, (snap) => {
        if (snap.val()) {
          props.removeParticipant(snap.key);
        }
      });
    }
  }, [isLocalParticipantSet, isStreamSet]);

  // get user from local storage / app context
  /**
   * if user is teacher set default preferences to be editable
   * for students, disable controls, only teacher can update individual students preferences. Only then can the student be allowed to speak.
   */
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

const mapStateToProps = (state) => {
  return {
    stream: state.mainStream,
    user: state.currentUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setMainStream: (stream) => dispatch(setMainStream(stream)),
    addParticipant: (user) => dispatch(addParticipant(user)),
    setUser: (user) => dispatch(setUser(user)),
    removeParticipant: (userId) => dispatch(removeParticipant(userId)),
    updateParticipant: (user) => dispatch(updateParticipant(user)),
    setClassroomInfo: (info) => dispatch(setClassroomInfo(info)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Classroom);
