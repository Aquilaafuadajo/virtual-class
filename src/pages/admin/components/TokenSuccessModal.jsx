import React from "react";

// components
import CustomButton from "../../../components/customButton";

// icons
import { ReactComponent as SuccessIcon } from "../../../assets/icons/success.svg";

import "../index.css";

const TokenSuccess = ({ isLoading, onSend, setIsModalOpen, token }) => {
  const clickAway = (e) => {
    e.stopPropagation();
    setIsModalOpen(false);
  };
  return (
    <div className="flex absolute top-0 left-0 right-0 bottom-0 justify-center items-center">
      <div className="relative">
        <div
          className="modal-overlay z-[99]"
          onClick={(e) => clickAway(e)}
        ></div>
      </div>
      <div className="flex flex-col items-center bg-white w-[80%] lg:w-[60%] p-10 rounded-lg z-[999]">
        <SuccessIcon className="mb-4" />
        <p className="text-base text-[#4F4F4F]">
          Token generated successfully. Click send to send
        </p>
        <p className="text-lg font-bold text-[#2F80ED] my-4">{`${token.substring(
          0,
          15
        )}...`}</p>
        <CustomButton
          onClick={onSend}
          isLoading={isLoading}
          text="Send Token"
        />
      </div>
    </div>
  );
};

export default TokenSuccess;
