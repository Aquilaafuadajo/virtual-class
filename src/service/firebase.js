import { async } from "@firebase/util";
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
import { getStorage, ref as storageRef, uploadBytes } from "firebase/storage";

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
export const lecturesRef = ref(db, "uploadedLectures");
export const connectedRef = ref(db, ".info/connected");

const storage = getStorage(app, "gs://react-chat-app-618b9.appspot.com");

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
            to_email: user.email,
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

export const createClassroom = async (data, onSuccess, onError) => {
  const newClassroomId = push(classroomRef).key;
  await set(ref(db, `classrooms/${newClassroomId}`), { metadata: data })
    .then(onSuccess(newClassroomId))
    .catch((error) => onError(error.message));
};

export const getClassroomInfo = async (data, onSuccess, onError) => {
  await get(child(classroomRef, `${data.classroomKey}/metadata`))
    .then(async (snapshot) => {
      if (snapshot.exists()) {
        onSuccess({ ...snapshot.val() });
      } else {
        return onError(
          "Oops! something went wrong, could not fetch classroom data"
        );
      }
    })
    .catch((error) => onError(error.message));
};

export const getClassroomParticipants = async (data, onSuccess, onError) => {
  await get(child(classroomRef, `${data.classroomKey}/participants`))
    .then(async (snapshot) => {
      if (snapshot.exists()) {
        onSuccess({ ...snapshot.val() });
      } else {
        return onError(
          "Oops! something went wrong, could not fetch list of participants"
        );
      }
    })
    .catch((error) => onError(error.message));
};

export const uploadLecture = async (data, onSuccess, onError) => {
  const { file, ...others } = data;
  const name = others.fileName.split(".");
  const uniqueName = `${name[0]}-${generateVerificationCode()}.${name[1]}`;
  await uploadBytes(storageRef(storage, `lectures/${uniqueName}`), data.file)
    .then(async () => {
      const newLectureId = push(lecturesRef).key;
      const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/react-chat-app-618b9.appspot.com/o/lectures%2F${uniqueName}?alt=media&token=dfea7ae3-2c0c-454c-ae73-c5fc5215efef`;
      await set(ref(db, `uploadedLectures/${newLectureId}`), {
        ...others,
        downloadUrl,
      })
        .then((snapshot) => onSuccess(snapshot))
        .catch((error) => onError(error.message));
    })
    .catch((error) => onError(error.message));
};

export const setWaving = (userName, id) => {
  set(ref(db, `classrooms/${id}/waving`), {
    username: `${userName}-${generateVerificationCode()}`,
  })
    .then((snapshot) => null)
    .catch((err) => console.log({ err }));
};

// end class function
