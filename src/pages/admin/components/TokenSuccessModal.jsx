import React from "react";

// components
import CustomButton from "../../../components/customButton";

// icons
import { ReactComponent as SuccessIcon } from "../../../assets/icons/success.svg";

const TokenSuccess = ({ isLoading, onSend, setIsModalOpen }) => {
  const clickAway = (e) => {
    e.stopPropagation();
    setIsModalOpen(false);
  };
  return (
    <div onClick={(e) => clickAway(e)} className="overlay">
      <div className="flex flex-col items-center bg-white w-[80%] lg:w-[60%] p-10 rounded-lg">
        <SuccessIcon className="mb-4" />
        <p className="text-base text-[#4F4F4F]">
          Token generated successfully. Click send to send
        </p>
        <p className="text-lg font-bold text-[#2F80ED] my-4">
          ssl8439LSKSlskdlsh489
        </p>
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
