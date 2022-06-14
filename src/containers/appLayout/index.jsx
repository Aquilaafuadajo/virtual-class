import React from "react";
// import { TransitionGroup, CSSTransition } from "react-transition-group";
import { useState } from "react";
import { useHistory } from "react-router-dom";

import { ReactComponent as Logo } from "../../assets/Logo.svg";

// context
import AppContext from "../../contexts/AppContext";

import "./index.css";

function AppLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = React.useContext(AppContext);
  const history = useHistory();
  const logout = () => {
    localStorage.removeItem("user");
    history.push("/login");
    setIsMenuOpen(false);
  };

  React.useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      const { userId, role } = JSON.parse(localUser);
      if (role === "admin") {
        history.push(`/app/admin/${userId}`);
      } else {
        history.push(`/app/${user.userId}`);
      }
    }
  }, []);
  return (
    <div className="w-full relative min-h-screen">
      <div className="fixed top-0 left-0 right-0 bg-white z-10">
        <div className="w-full px-4 py-3 lg:px-16 lg:py-6 flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="data:image/jpeg;base64,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"
              alt="lasu logo"
              className="w-[50px] h-12 lg:h-auto mr-3"
            />
            <div className="flex flex-col text-center lg:text-left font-semibold text-xs lg:text-sm">
              <p>Designed By Afuadajo Emmanuel Sewanu</p>
              <p>Department of Electronic and Computer Engineering</p>
              <p>Supervised By DR. A.I.O YUSSUFF</p>
            </div>
          </div>
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
            <button onClick={logout} className="font-medium text-base">
              {user ? "Log Out" : "Login"}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="fixed top-14 right-0 bottom-0 left-0 block h-full side-bar px-4 py-2 z-10 lg:hidden bg-white">
          <ul className="font-medium text-base">
            <li className="text-center p-5">
              <button onClick={logout}>{user ? "Log Out" : "Login"}</button>
            </li>
          </ul>
        </div>
      )}
      <div className="mt-[72px] lg:mt-[120px] px-2 lg:px-16">{children}</div>
    </div>
  );
}

export default AppLayout;
