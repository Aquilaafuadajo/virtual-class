import React from "react";
// import { TransitionGroup, CSSTransition } from "react-transition-group";
import { useState } from "react";
import { ReactComponent as Logo } from "../../assets/Logo.svg";

import "./index.css";

function AppLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="w-full relative min-h-screen">
      <div className="fixed top-0 left-0 right-0 bg-white z-10">
        <div className="w-full px-4 py-3 lg:px-16 lg:py-6 flex justify-between items-center">
          <Logo className="w-10 h-12 lg:w-auto lg:h-auto" />
          <div
            id="hamburger-1"
            className={`hamburger lg:hidden ${isMenuOpen ? "is-active" : ""}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
          </div>
          <div className="hidden lg:flex w-8/12 items-center justify-end">
            <p className="font-medium text-base">Give Us Feedback</p>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="fixed top-14 right-0 bottom-0 left-0 block h-full side-bar px-4 py-2 z-10 lg:hidden bg-white">
          <ul className="font-medium text-base">
            <li className="text-center p-5">Give Us Feedback</li>
            <li className="text-center p-5">Logout</li>
          </ul>
        </div>
      )}
      <div className="mt-[72px] lg:mt-[120px] px-2 lg:px-16">{children}</div>
    </div>
  );
}

export default AppLayout;
