import React, { useState, useEffect, useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// redux
import {
  setMainStream,
  addParticipant,
  setUser,
  setClassroomInfo,
  removeParticipant,
  updateParticipant,
  updateUser,
  addMessage,
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
import Clock from "./components/Clock";

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
  const isTeacher = user?.role === "teacher";

  const getUserStream = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    return localStream;
  };

  const participantRef = ref(
    db,
    `classrooms/${props.match.params.id}/participants`
  );
  const wavingRef = ref(db, `classrooms/${props.match.params.id}/waving`);
  const messagesRef = ref(db, `classrooms/${props.match.params.id}/messages`);
  useEffect(() => {
    async function initializeApp() {
      // get classroom metadata and store in state then display metadata info in ui
      localStorage.setItem("classroomKey", props.match.params.id);
      await getClassroomInfo(
        { classroomKey: props.match.params.id },
        async (data) => {
          props.setClassroomInfo({
            ...data,
            classRoomKey: props.match.params.id,
          });
          const stream = await getUserStream();
          stream.getVideoTracks()[0].enabled = false;
          stream.getAudioTracks()[0].enabled = isTeacher;

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
              props.setUser(
                {
                  [currentParticipantRef.key]: {
                    userId,
                    userName,
                    ...preference,
                  },
                },
                participantRef
              );
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
            if (
              snapshot.key === "audio" &&
              snap.key === Object.keys(props.user)[0]
            ) {
              props.stream.getAudioTracks()[0].enabled = snapshot.val();
            }
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
      onChildAdded(messagesRef, async (snap) => {
        props.addMessage({
          [snap.key]: {
            ...snap.val(),
          },
        });
      });
      onChildChanged(wavingRef, async (snap) => {
        notify(`👋🏼 ${snap.val().split("-")[0]} is waving...`);
      });
    }
  }, [isLocalParticipantSet, isStreamSet]);

  const videoRef = useRef(null);

  const participantKey = Object.keys(props.participants);
  const screenPresenter = participantKey.find((element) => {
    const currentParticipant = props.participants[element];
    return currentParticipant.screen || currentParticipant.video;
  });

  useEffect(() => {
    const participants = Object.keys(props.participants);

    if (videoRef.current && isTeacher) {
      videoRef.current.srcObject = props.stream;
      videoRef.current.muted = true;
    }
    if (!isTeacher) {
      const ownerId = participants.find(
        (idx) => props.participants[idx].userId === props.classroomInfo.ownerId
      );
      const owner = props.participants[ownerId];
      if (owner) {
        const pc = owner.peerConnection;
        const remoteStream = new MediaStream();
        pc.ontrack = (event) => {
          event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track);
          });
          if (videoRef) {
            videoRef.current.srcObject = remoteStream;
          }
        };
      }
    }
  }, [
    props.user,
    props.stream,
    props.classroomInfo,
    Object.values(props.participants).length,
  ]);

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

  const updateStream = (stream) => {
    for (let key in props.participants) {
      const sender = props.participants[key];
      if (sender.currentUser) continue;
      const peerConnectionVideo = sender.peerConnection
        .getSenders()
        .find((s) => (s.track ? s.track.kind === "video" : false));
      peerConnectionVideo.replaceTrack(stream.getVideoTracks()[0]);
      const peerConnectionAudio = sender.peerConnection
        .getSenders()
        .find((s) => (s.track ? s.track.kind === "audio" : false));
      peerConnectionAudio.replaceTrack(stream.getAudioTracks()[0]);
    }
    props.setMainStream(stream);
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
    localStream.getAudioTracks()[0].enabled = Object.values(
      props.user
    )[0].audio;

    updateStream(localStream);

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
        });
      } else if (navigator.mediaDevices.getDisplayMedia) {
        mediaStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
      } else {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { mediaSource: "screen" },
        });
      }

      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const audioTrack = audioStream.getAudioTracks()[0];
      audioTrack.enabled = Object.values(props.user)[0].audio;

      mediaStream.addTrack(audioTrack);

      mediaStream.getVideoTracks()[0].onended = onScreenShareEnd;

      updateStream(mediaStream);

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
  const notify = (text) => toast(text);

  return (
    <div className="w-screen h-screen bg-[#282828] relative flex justify-center items-center">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <MainScreen
        currentUser={currentUser}
        videoRef={videoRef}
        showAvatar={
          isTeacher
            ? !currentUser?.video &&
              !currentUser?.screen &&
              currentUser?.userName
            : !screenPresenter
        }
      />
      <div className="absolute bottom-0 right-0 left-0 flex flex-col h-full justify-end">
        {drawerOpen && (
          <Drawer
            drawerContent={drawerContent}
            onCloseDrawer={() => closeDrawer()}
            messagesRef={messagesRef}
          />
        )}
        <div className="flex justify-between px-3">
          <div className="flex flex-col">
            <p className="text-white text-lg font-bold">
              {`Title - ${props.classroomInfo?.title}`}
            </p>
            <p className="text-white text-lg font-bold">
              {`Lecturer - ${props.classroomInfo?.teacherName}`}
            </p>
            <p className="text-white text-lg font-bold">
              {`Department - ${props.classroomInfo?.department}`}
            </p>
            <Clock />
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
          match={props.match}
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
    participants: state.participants,
    classroomInfo: state.classroomInfo,
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
    addMessage: (msg) => dispatch(addMessage(msg)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Classroom);
