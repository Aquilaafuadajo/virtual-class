import React from "react";

// icons
import { ReactComponent as SuccessIcon } from "../../../assets/icons/success.svg";
import { ReactComponent as UploadIcon } from "../../../assets/icons/cloud_up.svg";
import { ReactComponent as FailureIcon } from "../../../assets/icons/cloud_close.svg";

import "../index.css";

const UploadModal = ({ isLoading, onUpload, onCancel, status, fileName }) => {
  return (
    <div className="flex absolute top-0 left-0 right-0 bottom-0 justify-center items-center modal-overlay z-[99]">
      <div className="flex flex-col items-center bg-white w-[80%] lg:w-[60%] p-10 rounded-lg z-[999]">
        {status === null && (
          <UploadIcon className={`mb-4 ${isLoading && "bounce"}`} />
        )}
        {status === "success" && <SuccessIcon className="mb-4" />}
        {status === "fail" && <FailureIcon className="mb-4" />}

        <p className="text-base text-[#2F80ED] my-4">{fileName}</p>
        <button
          onClick={onUpload}
          disabled={isLoading}
          className="bg-[#EDF2F7] text-[#2F80ED] mb-2 px-3 py-2 rounded-md"
        >
          Save and Upload
        </button>
        <button onClick={onCancel} className=" text-[#EB5757]">
          {status === "success" ? "Close" : "Cancel"}
        </button>
      </div>
    </div>
  );
};

export default UploadModal;
