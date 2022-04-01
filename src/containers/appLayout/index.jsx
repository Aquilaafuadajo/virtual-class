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
