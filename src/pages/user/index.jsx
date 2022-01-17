import React, { useState } from "react";

// components
import StudentPortal from "./student";
import TeacherPortal from "./teacher";

//styles
import "./index.css";

function User() {
  // check user from app context

  return true ? <StudentPortal /> : <TeacherPortal />;
}

export default User;
