import React, { useContext, useEffect, useReducer } from "react";
import validator from "validator";

import signupFormReducer, { SIGNUP_FORM_INITIAL_STATE } from "../../reducers/signupFormReducer";
import { updateInputAction } from "../../actions/signupFormActions";

import ButtonMain from "../shared/ButtonMain";
import formImg from "../../styles/img/login/form.png";
import signupFormTypes from "../../action-types/signupFormTypes";
import { setInvalidInputStyles } from "../../utils/formUtils";
import { professorSignUp } from "../../utils/http-requests/professors/professorHttpRequests";
import { getUserFromCookies, saveUserOnCookie } from "../../cookies/cookies";
import { useHistory } from "react-router-dom";
import { LoginContext } from "../../context/LoginContext";
import { loginAction } from "../../actions/loginActions";

const SignUpForm = ({ setIsInLoginMode }) => {
    const [formState, dispatchFormState] = useReducer(signupFormReducer, SIGNUP_FORM_INITIAL_STATE);
    const { dispatchUserData } = useContext(LoginContext);
    const history = useHistory();

    useEffect(() => {
        if (formState.values.password !== formState.values.repeatedPassword) {
            dispatchFormState(
                updateInputAction(
                    signupFormTypes.UPDATE_REPEATED_PASSWORD,
                    formState.values.repeatedPassword,
                    false,
                    "Please retype your password correctly."
                )
            )
        }
    }, [formState.values.password])

    const formSubmit = async (event) => {
        event.preventDefault();

        const data = { ...formState.values };
        delete data.repeatedPassword;

        const professor = await professorSignUp(data);

        if (professor.status === 400) {
            console.log('status400');
            return dispatchFormState(
                updateInputAction(
                    signupFormTypes.UPDATE_EMAIL,
                    formState.values.email,
                    false,
                    "Email already exists."
                )
            );
        }
        saveUserOnCookie(professor.data);
        dispatchUserData(loginAction(professor.data));
        history.push("/");
        // console.log(getUserFromCookies().data.professor);
    };

    const handleNameOnInput = (e) => {
        const nameInput = e.target.value.trim();

        dispatchFormState(updateInputAction(signupFormTypes.UPDATE_NAME, nameInput, true));
    };

    const handleEmailOnInput = (e) => {
        const emailInput = e.target.value.trim().toLowerCase();

        if (!validator.isEmail(emailInput))
            return dispatchFormState(
                updateInputAction(
                    signupFormTypes.UPDATE_EMAIL,
                    emailInput,
                    false,
                    "Please enter a valid email address."
                )
            );

        dispatchFormState(updateInputAction(signupFormTypes.UPDATE_EMAIL, emailInput, true));
    };

    const handlePasswordOnInput = (e) => {
        const passwordInput = e.target.value.trim();
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

        if (!passwordRegex.test(passwordInput))
            return dispatchFormState(
                updateInputAction(
                    signupFormTypes.UPDATE_PASSWORD,
                    passwordInput,
                    false,
                    "Please enter a valid password."
                )
            );

        dispatchFormState(updateInputAction(signupFormTypes.UPDATE_PASSWORD, passwordInput, true));
    };

    const handleRepeatedPasswordOnInput = (e) => {
        const repeatedPasswordInput = e.target.value.trim();
        const passwordState = formState.values.password;

        if (repeatedPasswordInput !== passwordState)
            return dispatchFormState(
                updateInputAction(
                    signupFormTypes.UPDATE_REPEATED_PASSWORD,
                    repeatedPasswordInput,
                    false,
                    "Please retype your password correctly."
                )
            );

        dispatchFormState(updateInputAction(signupFormTypes.UPDATE_REPEATED_PASSWORD, repeatedPasswordInput, true));
    };

    const changeToLoginMode = () => {
        setIsInLoginMode(true);
    };

    return (
        <div className="login-signup-page__content">
            <div className="login-signup-page__title">
                <img src={formImg} alt="" />
                <h1>Sign Up</h1>
            </div>
            <form className="login-singup-form" onSubmit={formSubmit}>
                <input type="text" placeholder="Name" onInput={handleNameOnInput} />

                {!formState.validities.isEmailValid && (
                    <div className="invalid-message">{formState.errorMessages.emailErrorMessage}</div>
                )}
                <input
                    type="text"
                    placeholder="Email"
                    onInput={handleEmailOnInput}
                    style={setInvalidInputStyles(!formState.validities.isEmailValid)}
                />

                {!formState.validities.isPasswordValid && (
                    <div className="invalid-message">{formState.errorMessages.passwordErrorMessage}</div>
                )}
                <input
                    type="password"
                    placeholder="Password"
                    onInput={handlePasswordOnInput}
                    style={setInvalidInputStyles(!formState.validities.isPasswordValid)}
                />

                {!formState.validities.isRepeatedPasswordValid && (
                    <div className="invalid-message">{formState.errorMessages.repeatedPasswordErrorMessage}</div>
                )}
                <input
                    type="password"
                    placeholder="Repeat your password"
                    onInput={handleRepeatedPasswordOnInput}
                    style={setInvalidInputStyles(!formState.validities.isRepeatedPasswordValid)}
                />
                {/* <span onClick={formSubmit}> */}
                    <ButtonMain
                        type="submit"
                        bgColor={formState.isFormValid ? "#04395E" : "#D62839"}
                        text="Sign Up"
                        color={"#FCF7F8"}
                        disabled={!formState.isFormValid}
                    />
                {/* </span> */}
                <div className="redirect-to-other-form">
                    <p>
                        Already have an account? Log in{" "}
                        <span className="redirect-to-other-form__link" onClick={changeToLoginMode}>
                            here
                        </span>
                        .
                    </p>
                </div>
            </form>
        </div>
    );
};

export default SignUpForm;
