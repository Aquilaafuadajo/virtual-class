import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Login from "./pages/login";
import SignUp from "./pages/signup";
import TeacherSignup from "./pages/signup/teacher";
import StudentSignup from "./pages/signup/student";
import Classroom from "./pages/classroom";

// containers
import AppLayout from "./containers/appLayout";

// context
import AppContext from "./contexts/AppContext";

// utils
import routes from "./routes";
import AuthRoute from "./utils/AuthRoute";

// styles
import "./App.css";

const App = () => {
  const localUser = localStorage.getItem("user");
  const [user, setUser] = useState(localUser ? JSON.parse(localUser) : null);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      <Router>
        <Switch>
          <AuthRoute path="/app/classroom/:id" component={Classroom} exact />
          <AppLayout>
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/" component={SignUp} />
              <Route exact path="/sign-up/teacher" component={TeacherSignup} />
              <Route exact path="/sign-up/student" component={StudentSignup} />

              {routes.map(({ path, component }) => (
                <AuthRoute path={path} component={component} exact key={path} />
              ))}
            </Switch>
          </AppLayout>
        </Switch>
      </Router>
    </AppContext.Provider>
  );
};

export default App;
