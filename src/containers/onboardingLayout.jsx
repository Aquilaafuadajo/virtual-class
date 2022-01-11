import React from "react";

function OnboardingLayout({ children }) {
  return (
    <div className="w-full flex justify-center items-center">
      <div className="shadow-md rounded p-6 lg:p-12 w-fit max-w-[630px] lg:min-w-[630px]">
        {children}
      </div>
    </div>
  );
}

export default OnboardingLayout;
