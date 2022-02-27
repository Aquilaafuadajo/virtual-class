import { addConnection } from "../service/peerConnection";
import {
  SET_MAIN_STREAM,
  ADD_PARTICIPANT,
  SET_USER,
  SET_CLASSROOM_INFO,
  REMOVE_PARTICIPANT,
  UPDATE_USER,
  UPDATE_PARTICIPANT,
} from "./actiontypes";

import {
  initializeListensers,
  updatePreference,
} from "../service/peerConnection";

let defaultUserState = {
  classRoomInfo: null,
  mainStream: null,
  participants: {},
  currentUser: null,
};

export const userReducer = (state = defaultUserState, action) => {
  if (action.type === SET_MAIN_STREAM) {
    let payload = action.payload;
    state = {
      ...state,
      ...payload,
    };
    return state;
  } else if (action.type === SET_CLASSROOM_INFO) {
    let payload = action.payload;
    state = {
      ...state,
      ...payload,
    };
    return state;
  } else if (action.type === ADD_PARTICIPANT) {
    let payload = action.payload;
    const currentUserId = Object.keys(state.currentUser)[0];
    const newUserId = Object.keys(payload.newUser)[0];
    if (state.mainStream && currentUserId !== newUserId) {
      payload.newUser = addConnection(
        payload.newUser,
        state.currentUser,
        state.mainStream
      );
    }

    if (currentUserId === newUserId)
      payload.newUser[newUserId].currentUser = true;
    let participants = {
      ...state.participants,
      ...payload.newUser,
    };
    state = {
      ...state,
      participants,
    };
    return state;
  } else if (action.type === SET_USER) {
    let payload = action.payload;
    let participants = {
      ...state.participants,
    };
    const userId = Object.keys(payload.currentUser)[0];
    initializeListensers(userId);
    state = {
      ...state,
      currentUser: {
        ...payload.currentUser,
      },
      participants,
    };
    return state;
  } else if (action.type === REMOVE_PARTICIPANT) {
    let payload = action.payload;
    let participants = {
      ...state.participants,
    };
    delete participants[payload.id];
    state = {
      ...state,
      participants,
    };
    return state;
  } else if (action.type === UPDATE_USER) {
    let payload = action.payload;
    const userId = Object.keys(state.currentUser)[0];
    updatePreference(userId, payload.currentUser);
    state.currentUser[userId] = {
      ...state.currentUser[userId],
      ...payload.currentUser,
    };
    state = {
      ...state,
      currentUser: {
        ...state.currentUser,
      },
    };
    return state;
  } else if (action.type === UPDATE_PARTICIPANT) {
    let payload = action.payload;
    const newUserId = Object.keys(payload.newUser)[0];

    payload.newUser[newUserId] = {
      ...state.participants[newUserId],
      ...payload.newUser[newUserId],
    };
    let participants = {
      ...state.participants,
      ...payload.newUser,
    };
    console.log(participants);
    state = {
      ...state,
      participants,
    };
    return state;
  }
  return state;
};
