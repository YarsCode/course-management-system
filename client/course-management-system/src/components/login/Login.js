import React, { useState } from "react";
import LoginForm from "./LoginForm";

import SignUpForm from "./SignUpForm";

const Login = (props) => {
    const [isInLoginMode, setIsInLoginMode] = useState(true);
    const unauthorizedErrorMessage = props.location.state?.needToLogin ? "You must login!" : "";

    return (
        <main className="login-signup-page">
            {isInLoginMode ? (
                <LoginForm setIsInLoginMode={setIsInLoginMode} unauthorizedErrorMessage={unauthorizedErrorMessage} />
            ) : (
                <SignUpForm setIsInLoginMode={setIsInLoginMode} />
            )}
        </main>
    );
};

export default Login;
