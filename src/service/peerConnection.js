// firebase
import { child, push, ref, set, update, onChildAdded } from "firebase/database";
import { db } from "./firebase";
import { store } from "..";

const servers = {
  iceServers: [
    {
      urls: [
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        "stun:stun.l.google.com:19302",
        "stun:stun3.l.google.com:19302",
        "stun:stun4.l.google.com:19302",
        "stun:stun.services.mozilla.com",
      ],
    },
  ],
  iceCandidatePoolSize: 10,
};

const classRoomKey = localStorage.getItem("classroomKey");
const participantRef = ref(db, `classrooms/${classRoomKey}/participants`);

export const addConnection = (newUser, currentUser, stream) => {
  const peerConnection = new RTCPeerConnection(servers);
  stream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, stream);
  });
  const newUserId = Object.keys(newUser)[0];
  const currentUserId = Object.keys(currentUser)[0];

  const offerIds = [newUserId, currentUserId].sort((a, b) =>
    a.localeCompare(b)
  );

  newUser[newUserId].peerConnection = peerConnection;
  if (offerIds[0] !== currentUserId)
    createOffer(peerConnection, offerIds[0], offerIds[1]);
  return newUser;
};

export const updatePreference = (userId, preference) => {
  const currentParticipantRef = child(participantRef, `${userId}/preference`);

  setTimeout(() => {
    update(currentParticipantRef, preference);
  });
};

export const createOffer = async (peerConnection, receiverId, createdID) => {
  const currentParticipantRef = child(participantRef, `${receiverId}`);

  peerConnection.onicecandidate = (event) => {
    event.candidate &&
      push(child(currentParticipantRef, "offerCandidates"), {
        ...event.candidate.toJSON(),
        userId: createdID,
      });
  };

  const offerDescription = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offerDescription);

  const offer = {
    sdp: offerDescription.sdp,
    type: offerDescription.type,
    userId: createdID,
  };

  const offerKey = push(child(currentParticipantRef, "offers")).key;

  await set(child(currentParticipantRef, `offers/${offerKey}`), { offer });
};

export const initializeListensers = async (userId) => {
  const currentUserRef = child(participantRef, `${userId}`);

  onChildAdded(child(currentUserRef, "offers"), async (snapshot) => {
    const data = snapshot.val();
    if (data?.offer) {
      const pc =
        store.getState().participants[data.offer.userId].peerConnection;
      await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
      await createAnswer(data.offer.userId, userId);
    }
  });

  onChildAdded(child(currentUserRef, "offerCandidates"), (snapshot) => {
    const data = snapshot.val();
    if (data.userId) {
      const pc = store.getState().participants[data.userId].peerConnection;
      pc.addIceCandidate(new RTCIceCandidate(data));
    }
  });

  onChildAdded(child(currentUserRef, "answers"), (snapshot) => {
    const data = snapshot.val();
    if (data?.answer) {
      const pc =
        store.getState().participants[data.answer.userId].peerConnection;
      const answerDescription = new RTCSessionDescription(data.answer);
      pc.setRemoteDescription(answerDescription);
    }
  });

  onChildAdded(child(currentUserRef, "answerCandidates"), (snapshot) => {
    const data = snapshot.val();
    if (data.userId) {
      const pc = store.getState().participants[data.userId].peerConnection;
      pc.addIceCandidate(new RTCIceCandidate(data));
    }
  });
};

const createAnswer = async (otherUserId, userId) => {
  const pc = store.getState().participants[otherUserId].peerConnection;
  const participantRef1 = child(participantRef, `${otherUserId}`);
  pc.onicecandidate = (event) => {
    event.candidate &&
      push(child(participantRef1, "answerCandidates"), {
        ...event.candidate.toJSON(),
        userId: userId,
      });
  };

  const answerDescription = await pc.createAnswer();
  await pc.setLocalDescription(answerDescription);

  const answer = {
    type: answerDescription.type,
    sdp: answerDescription.sdp,
    userId: userId,
  };

  const answerKey = push(child(participantRef1, "answers")).key;

  await set(child(participantRef1, `answers/${answerKey}`), { answer });
};
