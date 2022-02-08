import { initializeApp } from "firebase/app";
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
  get,
} from "firebase/database";

// send mail
import { generateVerificationCode } from "../utils";
import sendMail from "../utils/emailjs";

const firebaseConfig = {
  apiKey: "AIzaSyD8kwO-rMzsrUhNrOL9Ig-TwtdJrnQusaE",
  authDomain: "react-chat-app-618b9.firebaseapp.com",
  databaseURL: "https://react-chat-app-618b9.firebaseio.com",
  projectId: "react-chat-app-618b9",
  storageBucket: "react-chat-app-618b9.appspot.com",
  messagingSenderId: "713967196169",
  appId: "1:713967196169:web:9aaa1721dbaf8971da00d8",
  measurementId: "G-E68NNBZN05",
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const usersRef = ref(db, "users");
export const classroomRef = ref(db, "classrooms");

export const signup = async (data, onSuccess, onError) => {
  // check for existing user
  await get(query(usersRef, orderByChild("email"), equalTo(data.email)))
    .then(async (snapshot) => {
      if (snapshot.exists()) {
        return onError("User with email already exists!");
      } else {
        const newUserId = push(usersRef).key;
        await set(ref(db, `users/${newUserId}`), data)
          .then(onSuccess(newUserId))
          .catch((error) => onError(error.message));
      }
      return;
    })
    .catch((error) => onError(error.message));
};

export const login = async (data, onSuccess, onError) => {
  await get(query(usersRef, orderByChild("email"), equalTo(data.email)))
    .then(async (snapshot) => {
      if (snapshot.exists()) {
        const user = Object.values(snapshot.val())[0];
        if (user.status && user.status === "pending") {
          return onError("This user is awaiting approval");
        } else {
          // send login code
          const code = generateVerificationCode();
          const mail = {
            to_name: user.fullname,
            message: code,
          };
          onSuccess({ code });
          // await sendMail(mail, 'login')
          //   .then(() => onSuccess({ code }))
          //   .catch((err) =>
          //     onError(
          //       "Opps! Something went wrong, unable to send verification code at the moment, please try again later."
          //     )
          //   );
        }
      } else {
        return onError("User with email does not exist");
      }
    })
    .catch((error) => onError(error.message));
};

export const teacherSignUp = async (data, onSuccess, onError) => {
  await get(query(usersRef, orderByChild("email"), equalTo(data.email)))
    .then(async (snapshot) => {
      if (snapshot.exists()) {
        const code = generateVerificationCode();
        onSuccess({ code });
        // await sendMail(mail, "login")
        //   .then(() => onSuccess({ code }))
        //   .catch((err) =>
        //     onError(
        //       "Opps! Something went wrong, unable to send verification code at the moment, please try again later."
        //     )
        //   );
      } else {
        return onError("User with email does not exist");
      }
    })
    .catch((error) => onError(error.message));
};

export const confirmTeacherSignUp = async (data, onSuccess, onError) => {
  await get(query(usersRef, orderByChild("email"), equalTo(data.email)))
    .then(async (snapshot) => {
      if (snapshot.exists()) {
        const { code, ...rest } = data;
        const user = {
          ...Object.values(snapshot.val())[0],
          userId: Object.keys(snapshot.val())[0],
          ...rest,
          status: "approved",
          role: "teacher",
        };
        await update(usersRef, {
          [`/${user.userId}`]: {
            ...rest,
            status: "approved",
            role: "teacher",
            // delete token
          },
        })
          .then(() => {
            onSuccess(user);
          })
          .catch((error) => {
            onError(error.message);
          });
      } else {
        return onError("User with email does not exist");
      }
    })
    .catch((error) => onError(error.message));
};

export const saveUserToken = async (data, onSuccess, onError) => {
  await update(usersRef, {
    [`/${data.userId}/token`]: {
      token: data.token,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    },
  })
    .then(onSuccess)
    .catch((error) => onError(error.message));
};

export const getUserToken = async (data, onSuccess, onError) => {
  await get(query(usersRef, orderByChild("email"), equalTo(data.email)))
    .then(async (snapshot) => {
      if (snapshot.exists()) {
        const token = Object.values(snapshot.val())[0].token;
        onSuccess(token);
      } else {
        return onError(
          "Oops! something went wrong, could not fetch user token"
        );
      }
    })
    .catch((error) => onError(error.message));
};

export const getUser = async (data, onSuccess, onError) => {
  await get(query(usersRef, orderByChild("email"), equalTo(data.email)))
    .then(async (snapshot) => {
      if (snapshot.exists()) {
        const user = Object.values(snapshot.val())[0];
        const userKey = Object.keys(snapshot.val())[0];
        onSuccess({ userId: userKey, ...user });
      } else {
        return onError("Oops! something went wrong, could not fetch user data");
      }
    })
    .catch((error) => onError(error.message));
};

export const getPendingUsers = async (onSuccess, onError) => {
  await get(query(usersRef, orderByChild("status"), equalTo("pending")))
    .then(async (snapshot) => {
      if (snapshot.exists()) {
        const pendingUsers = Object.entries(snapshot.val()).map((user) => {
          return {
            userId: user[0],
            ...user[1],
          };
        });
        return onSuccess(pendingUsers);
      } else {
        return onError("Oops! something went wrong, could not fetch user data");
      }
    })
    .catch((error) => onError(error.message));
};

export const createClassroom = async (data, onSuccess, onError) => {};
