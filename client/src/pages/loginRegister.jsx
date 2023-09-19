import React, { useState } from "react";
import Login from "../components/logReg/login";
import Register from "../components/logReg/register";

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
