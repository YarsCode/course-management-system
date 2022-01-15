import React, { useRef } from 'react'
import Button from "../shared/Button";

const LoginForm = () => {
    const test = useRef(null);

    const formSubmit = (event) => {
        event.preventDefault();
        // history.push("/rooms");
        // console.log("Login Form:", email, password);
        // dispatchUserData(loginAction());
        // loginToSite(email, password).then(
        //     (userData) => {
        //         dispatchUserData(loginAction(userData));
        //         saveUserOnCookie(userData);
        //         history.push("/rooms");
        //     },
        //     (err) => {
        //         if (err.message === "The email or password are incorrect.") {
        //             setErrorMessage(err.message);
        //         }
        //     }
        // );
        console.log(test.current.value);
    };

    return (
        <div>
            <form className="login-form" onSubmit={formSubmit}>
                <input type="text" placeholder="Email" ref={test} />
                <input type="password" placeholder="Password" ref={test} />
                {/* {!formState.validities.isEmailValid && <div className="invalid-message">{formState.errorMessages.emailErrorMessage}</div>}
                <input type="password" placeholder="Password" onBlur={onBlurPasswordInput} />
                {!formState.validities.isPasswordValid && <div className="invalid-message">{formState.errorMessages.passwordErrorMessage}</div>} */}
                <div className="login-form__nav">
                    {/* <button type="submit" > */}
                        {/* Submit */}
                        <Button bgColor="#04395E" text="Submit" color={"#FCF7F8"}/>
                    {/* </button> */}
                    {/* <div onClick={onClickSubscribe}>Subscribe</div> */}
                </div>
            </form>
        </div>
    )
}

export default LoginForm
