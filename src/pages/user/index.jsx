import React, { useState, useContext } from "react";

// context
import AppContext from "../../contexts/AppContext";

// components
import StudentPortal from "./student";
import TeacherPortal from "./teacher";

//styles
import "./index.css";

function User() {
  const { user } = useContext(AppContext);

  return user?.role === "student" ? (
    <StudentPortal />
  ) : user?.role === "teacher" ? (
    <TeacherPortal />
  ) : null;
}

export default User;
