import React from "react";

const ControlButton = ({ icon, activeClass, onClick, ...props }) => (
  <button
    onClick={onClick}
    className={`bg-[#2F80ED] rounded-full p-3 flex items-center justify-center mx-2 ${activeClass}`}
    {...props}
  >
    {icon}
  </button>
);

export default ControlButton;
