import React from "react";
import LoginForm from "./LoginForm";

import formImg from "../../styles/img/login/form.png";

const Login = () => {
    return (
        <main className="login-page">
            <div className="login-page__content">
                <div className="login-title">
                    <img src={formImg} alt="" />
                    <h1>Login</h1>
                </div>
                <LoginForm />
            </div>
        </main>
    );
};

export default Login;
