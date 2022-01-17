import React, { useState } from "react";

// components
import TokenSuccess from "./components/TokenSuccessModal";

//styles
import "./index.css";

function AdminPortal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const generateToken = () => {
    setIsModalOpen(!isModalOpen);
  };

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
              Afuadajo Emmanuel
            </p>
          </div>
          <div className="flex justify-start">
            <p className="text-sm lg:text-lg text-[#333333] w-[30%] lg:w-[20%]">
              Email:
            </p>
            <p className="text-sm lg:text-lg text-[#333333] text-left">
              aquilaafuadajo@las.edu.ng
            </p>
          </div>
          <div className="flex justify-start">
            <p className="text-sm lg:text-lg text-[#333333] w-[30%] lg:w-[20%]">
              Role:
            </p>
            <p className="text-sm lg:text-lg text-[#333333] text-left">Admin</p>
          </div>
        </div>
      </div>
      <div className="flex mt-12">
        <h3 className="font-bold text-[#282828] text-lg lg:text-3xl my-4">
          Pending Requests
        </h3>
      </div>
      <ul className="flex flex-col mt-5 bg-[#FAFAFA]">
        <li className="flex justify-between items-center border-b border-[#c9c9c9ce] py-3">
          <p className="text-lg font-bold text-[#2F80ED]">
            aquilaafuadajo@lasu.edu.ng
          </p>
          <button
            onClick={() => generateToken()}
            className="px-8 py-2 font-bold rounded-2xl text-[#2F80ED] bg-[#2f81ed51]"
          >
            Generate Token
          </button>
        </li>
        <li className="flex justify-between items-center border-b border-[#c9c9c9ce] py-3">
          <p className="text-lg font-bold text-[#2F80ED]">
            aquilaafuadajo@lasu.edu.ng
          </p>
          <button
            onClick={() => generateToken()}
            className="px-8 py-2 font-bold rounded-2xl text-[#2F80ED] bg-[#2f81ed51]"
          >
            Generate Token
          </button>
        </li>
      </ul>
      {isModalOpen && (
        <TokenSuccess
          setIsModalOpen={setIsModalOpen}
          onSend={() => setIsModalOpen(!isModalOpen)}
        />
      )}
    </div>
  );
}

export default AdminPortal;
