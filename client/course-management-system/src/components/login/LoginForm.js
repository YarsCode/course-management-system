import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

import ButtonMain from "../shared/ButtonMain";

import { studentLogin } from "../../utils/http-requests/students/studentHttpRequests";
import { professorLogin } from "../../utils/http-requests/professors/professorHttpRequests";
import { setInvalidInputStyles } from "../../utils/formUtils";
import { saveUserOnCookie } from "../../cookies/cookies";
import { LoginContext } from "../../context/LoginContext";
import formImg from "../../styles/img/login/form.png";
import { loginAction } from "../../actions/loginActions";

const LoginForm = ({ setIsInLoginMode, unauthorizedErrorMessage }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isValidPassword, setIsValidPassword] = useState(true);
    const [isValidForm, setIsValidForm] = useState(false);
    const [role, setRole] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const { dispatchUserData } = useContext(LoginContext);

    const history = useHistory();

    useEffect(() => {
        email !== "" && password !== "" && role ? setIsValidForm(true) : setIsValidForm(false);
    }, [email, password, role]);

    const formSubmit = async (event) => {
        event.preventDefault();

        const data = { email: event.target.email.value, password: event.target.password.value };

        if (role.target.id === "student") {
            const student = await studentLogin(data);

            if (student.status >= 400) return setErrorMessage("Your email or password are incorrect.");

            student.data.role = "student";

            saveUserOnCookie(student.data);
            dispatchUserData(loginAction(student.data));
            history.push("/");
        } else if (role.target.id === "professor") {
            const professor = await professorLogin(data);

            if (professor.status >= 400) return setErrorMessage("Your email or password are incorrect.");

            professor.data.role = "professor";

            saveUserOnCookie(professor.data);
            dispatchUserData(loginAction(professor.data));
            history.push("/professor-manage-courses");
        }
    };

    const handleEmailOnInput = (e) => {
        const inputEmail = e.target.value.trim();
        setEmail(inputEmail);

        inputEmail === "" ? setIsValidEmail(false) : setIsValidEmail(true);
    };

    const handlePasswordOnInput = (e) => {
        const inputPassword = e.target.value.trim();
        setPassword(inputPassword);

        inputPassword === "" ? setIsValidPassword(false) : setIsValidPassword(true);
    };

    const changeToSignUpMode = () => {
        setIsInLoginMode(false);
    };

    return (
        <div className="login-signup-page__content">
            <div className="login-signup-page__title">
                <img src={formImg} alt="" />
                <h1>Login</h1>
            </div>
            {errorMessage !== "" && <div className="invalid-message">{errorMessage}</div>}
            {unauthorizedErrorMessage !== "" && <div className="invalid-message">{unauthorizedErrorMessage}</div>}
            <form className="login-singup-form" onSubmit={formSubmit}>
                <input
                    type="text"
                    placeholder="Email"
                    name="email"
                    onBlur={handleEmailOnInput}
                    style={setInvalidInputStyles(errorMessage !== "" || !isValidEmail)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    onBlur={handlePasswordOnInput}
                    style={setInvalidInputStyles(errorMessage !== "" || !isValidPassword)}
                />
                <div className="choose-login-as-student-or-professor">
                    <div className="student-radio-btn">
                        <input type="radio" id="student" name="role" onChange={setRole} />
                        <label htmlFor="student">Student</label>
                    </div>
                    <div className="professor-radio-btn">
                        <input type="radio" id="professor" name="role" onChange={setRole} />
                        <label htmlFor="professor">Professor</label>
                    </div>
                </div>

                <ButtonMain
                    type="submit"
                    bgColor={isValidForm ? "#04395E" : "#D62839"}
                    color="#FCF7F8"
                    text="Login"
                    disabled={!isValidForm}
                />
                <div className="redirect-to-other-form">
                    <p>
                        Don't have an account yet? Sign Up{" "}
                        <span className="redirect-to-other-form__link" onClick={changeToSignUpMode}>
                            here
                        </span>
                        .
                    </p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
