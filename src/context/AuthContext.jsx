import React, { Children, createContext, useState } from "react";

const AuthContext = createContext();

function AuthContextComponent({ Children }) {
  const [user, setUser] = useState({});
  const [isLogged, SetIsLogged] = useState(false);

  const handleLogin = (user) => {};

  const handleLogout = () => {};

  return <AuthContext.Provider>{Children}</AuthContext.Provider>;
}

export default AuthContextComponent;
