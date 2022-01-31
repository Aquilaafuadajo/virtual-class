import React from "react";
import { Link } from "react-router-dom";

function CustomButton({ text, onClick, isLoading, disabled, isLink, to }) {
  return !isLink ? (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className="flex items-center justify-center bg-blue-500 text-center w-full py-2 lg:py-4 rounded font-normal text-sm lg:text-lg text-white mb-3"
    >
      {!isLoading ? text : <div className="lds-dual-ring"></div>}
    </button>
  ) : (
    <Link
      to={to}
      disabled={isLoading}
      className="flex items-center justify-center bg-blue-500 text-center w-full py-2 lg:py-4 rounded font-normal text-sm lg:text-lg text-white mb-3"
    >
      {!isLoading ? text : <div className="lds-dual-ring"></div>}
    </Link>
  );
}

export default CustomButton;
