import React, { useState, useEffect, useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

// redux
import {
  setMainStream,
  addParticipant,
  setUser,
  setClassroomInfo,
  removeParticipant,
  updateParticipant,
  updateUser,
} from "../../store/actioncreator";

// firebase
import {
  child,
  push,
  ref,
  onValue,
  onDisconnect,
  onChildChanged,
  onChildAdded,
  onChildRemoved,
} from "firebase/database";
import { db, connectedRef, getClassroomInfo } from "../../service/firebase";

// components
import Drawer from "./components/Drawer";
import Footer from "./components/Footer";
import MainScreen from "./components/MainScreen";

// context
import AppContext from "../../contexts/AppContext";

// icons
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
              const { userId, userName, preference } = participantInfo;
              // if teacher, end lecture and delete room else just remove student from participants
              props.setUser({
                [currentParticipantRef.key]: {
                  userId,
                  userName,
                  ...preference,
                },
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
      // listen for local participant preference change and toggle mic remotely
      onChildAdded(participantRef, async (snap) => {
        if (snap.exists()) {
          const preferenceRef = child(participantRef, `${snap.key}/preference`);
          onChildChanged(preferenceRef, (snapshot) => {
            props.updateParticipant({
              [snap.key]: {
                [snapshot.key]: snapshot.val(),
              },
            });
          });

          const { userId, userName, preference } = snap.val();
          props.addParticipant({
            [snap.key]: {
              userId,
              userName,
              ...preference,
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

  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      // if teacher, video ref is props.stream else it's remote stream
      videoRef.current.srcObject = props.stream;
      videoRef.current.muted = true;
    }
  }, [props.user, props.stream]);

  const currentUser = props.user ? Object.values(props.user)[0] : null;

  const onMicClick = (micEnabled) => {
    if (props.stream) {
      props.stream.getAudioTracks()[0].enabled = micEnabled;
      props.updateUser({ audio: micEnabled });
    }
  };
  const onVideoClick = (videoEnabled) => {
    if (props.stream) {
      props.stream.getVideoTracks()[0].enabled = videoEnabled;
      props.updateUser({ video: videoEnabled });
    }
  };

  const onScreenShareEnd = async () => {
    props.stream.getTracks().forEach((track) => track.stop());
    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    localStream.getVideoTracks()[0].enabled = Object.values(
      props.user
    )[0].video;

    props.setMainStream(localStream);

    props.updateUser({ screen: false });
  };

  const onScreenClick = async () => {
    if (Object.values(props.user)[0].screen) {
      onScreenShareEnd();
      props.updateUser({ screen: false });
    } else {
      let mediaStream;
      if (navigator.getDisplayMedia) {
        mediaStream = await navigator.getDisplayMedia({
          video: true,
          audio: true,
        });
      } else if (navigator.mediaDevices.getDisplayMedia) {
        mediaStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
      } else {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { mediaSource: "screen" },
          audio: true,
        });
      }

      mediaStream.getVideoTracks()[0].onended = onScreenShareEnd;

      props.setMainStream(mediaStream);

      props.updateUser({ screen: true });
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
      <MainScreen
        currentUser={currentUser}
        videoRef={videoRef}
        showAvatar={
          !currentUser?.video && !currentUser?.screen && currentUser?.userName
        }
      />
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
        <Footer
          isTeacher={isTeacher}
          onScreenClick={onScreenClick}
          onMicClick={onMicClick}
          onVideoClick={onVideoClick}
        />
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
    updateUser: (stream) => dispatch(updateUser(stream)),
    addParticipant: (user) => dispatch(addParticipant(user)),
    setUser: (user) => dispatch(setUser(user)),
    removeParticipant: (userId) => dispatch(removeParticipant(userId)),
    updateParticipant: (user) => dispatch(updateParticipant(user)),
    setClassroomInfo: (info) => dispatch(setClassroomInfo(info)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Classroom);
