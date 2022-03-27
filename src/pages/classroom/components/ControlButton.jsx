import React, { forwardRef } from "react";

const ControlButton = forwardRef(
  ({ icon, activeClass, className, onClick, ...props }, ref) => (
    <button
      ref={ref}
      onClick={onClick}
      className={className || `bg-[#2F80ED] rounded-full p-3 flex items-center justify-center mx-2 ${activeClass}`}
      {...props}
    >
      {icon}
    </button>
  )
);

export default ControlButton;
