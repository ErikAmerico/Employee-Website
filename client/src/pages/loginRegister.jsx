import React, { useState } from "react";
import Login from "../components/logReg/Login";
import Register from "../components/logReg/Register";


export default function LoginRegister() {
  const [showLogin, setShowLogin] = useState(true);

  const toggleForm = () => {
    setShowLogin((prevState) => !prevState);
  };

  return (
    <div className="login-container">
      {showLogin ? (
        <Login toggleForm={toggleForm} />
      ) : (
        <Register toggleForm={toggleForm} />
      )}
    </div>
  );
}