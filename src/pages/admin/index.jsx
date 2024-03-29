import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

// components
import TokenSuccess from "./components/TokenSuccessModal";

// context
import AppContext from "../../contexts/AppContext";

// firebase
import { getPendingUsers, saveUserToken } from "../../service/firebase";

// utils
import { generateToken, verifyToken } from "../../utils/jwt";
import sendMail from "../../utils/emailjs";

//styles
import "./index.css";

function AdminPortal() {
  const { user } = useContext(AppContext);
  const history = useHistory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [pendingUsers, setPendingUsers] = useState([]);
  // fetch pending users, filter the ones with token and check if the token has expired, if the token expired, add them to pending users. Else only add the ones with status pending.
  const [token, setToken] = useState("");

  const onTokenGenerate = (data) => {
    const jwtToken = generateToken(data);
    setToken(jwtToken);
    setIsModalOpen(!isModalOpen);
  };

  const sendToken = async () => {
    setIsButtonLoading(true);
    const decoded = verifyToken(token);
    await saveUserToken(
      { userId: decoded.userId, token },
      async () => {
        const url = `${window.location.protocol}//${window.location.host}/sign-up/teacher?token=${token}`;
        const mail = {
          to_name: decoded.fullname,
          to_email: decoded.email,
          message: url,
        };
        await sendMail(mail, "request_approved")
          .then(() => {
            setIsButtonLoading(false);
            setIsModalOpen(!isModalOpen);
          })
          .catch((err) =>
            alert(
              "Opps! Something went wrong, unable to send token url at the moment, please try again later."
            )
          );
        // send token to email
        console.log(url);
      },
      (err) => alert(err)
    );
  };

  useEffect(() => {
    if (user.role !== "admin") {
      history.push(`/app/${user.userId}`);
    }
    const makeRequest = async () => {
      // setIsLoading(true);
      await getPendingUsers(
        (users) => {
          setPendingUsers(users);
          setIsLoading(false);
        },
        (error) => {
          alert(error);
        }
      );
    };

    makeRequest();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="w-full flex flex-col">
        <h3 className="font-bold text-[#282828] text-xl lg:text-3xl my-4">
          Admin Information
        </h3>
        <div className="flex flex-col w-full">
          <div className="flex justify-start">
            <p className="text-sm lg:text-lg text-[#333333] w-[30%] lg:w-[20%]">
              Full Name:
            </p>
            <p className="text-sm lg:text-lg text-[#333333] text-left">
              {user.fullname}
            </p>
          </div>
          <div className="flex justify-start">
            <p className="text-sm lg:text-lg text-[#333333] w-[30%] lg:w-[20%]">
              Email:
            </p>
            <p className="text-sm lg:text-lg text-[#333333] text-left">
              {user.email}
            </p>
          </div>
          <div className="flex justify-start">
            <p className="text-sm lg:text-lg text-[#333333] w-[30%] lg:w-[20%]">
              Role:
            </p>
            <p className="text-sm lg:text-lg text-[#333333] text-left">
              {user.role}
            </p>
          </div>
        </div>
      </div>
      <div className="flex mt-12">
        <h3 className="font-bold text-[#282828] text-lg lg:text-3xl my-4">
          Pending Requests
        </h3>
      </div>
      <ul className="flex flex-col mt-5 bg-[#FAFAFA]">
        {isLoading && <p>Loading...</p>}
        {pendingUsers &&
          pendingUsers.map((user) => (
            <li
              key={user.userId}
              className="flex justify-between items-center border-b border-[#c9c9c9ce] py-3"
            >
              <p className="text-lg font-bold text-[#2F80ED]">{user.email}</p>
              <button
                onClick={() => onTokenGenerate(user)}
                className="px-8 py-2 font-bold rounded-2xl text-[#2F80ED] bg-[#2f81ed51]"
              >
                Generate Token
              </button>
            </li>
          ))}
      </ul>
      {isModalOpen && (
        <TokenSuccess
          token={token}
          setIsModalOpen={setIsModalOpen}
          onSend={sendToken}
          isLoading={isButtonLoading}
        />
      )}
    </div>
  );
}

export default AdminPortal;
