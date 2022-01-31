import React, { useContext } from "react";
import { Route, useHistory } from "react-router-dom";

// contexts
import AppContext from "../contexts/AppContext";

const AuthRoute = ({ component: Component, ...rest }) => {
  const history = useHistory();
  const { user } = useContext(AppContext);

  if (!user) history.push("/login");

  return <Route {...rest} render={(props) => <Component {...props} />} />;
};

export default AuthRoute;
