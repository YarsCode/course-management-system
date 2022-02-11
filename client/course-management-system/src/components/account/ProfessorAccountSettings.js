import React, { useContext, useEffect, useState } from "react";

import { LoginContext } from "../../context/LoginContext";

import validator from "validator";
import ButtonMain from "../shared/ButtonMain";
import { deleteProfessor, editProfessor } from "../../utils/http-requests/professors/professorHttpRequests";
import { deleteUserFromCookie, getUserFromCookies, saveUserOnCookie } from "../../cookies/cookies";
import { loginAction, logoutAction } from "../../actions/loginActions";
import { useHistory } from "react-router-dom";

const ProfessorAccountSettings = () => {
    const { userData, dispatchUserData } = useContext(LoginContext);
    const [isInEditingMode, setIsInEditingMode] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [password, setPassword] = useState("");
    const [isValidPassword, setIsValidPassword] = useState(true);
    const [repeatedPassword, setRepeatedPassword] = useState("");
    const [isValidRepeatedPassword, setIsValidRepeatedPassword] = useState(true);
    const [accountEditForm, setAccountEditForm] = useState({});
    const [isFormValid, setIsFormValid] = useState(true);
    const history = useHistory();

    useEffect(() => {
        // Makes sure the form stays invalid when password changes
        if (password !== repeatedPassword) {
            setIsValidRepeatedPassword(false);
            setIsFormValid(false);
        } else {
            setIsValidRepeatedPassword(true);
            setIsFormValid(true);
        }
    }, [password, repeatedPassword]);

    const handleEditButtonClick = async () => {
        if (isInEditingMode) {
            const editedProfessor = await editProfessor(userData, userData.professor._id, accountEditForm);

            if (editedProfessor) {
                const updatedDataForCookie = {
                    professor: { ...editedProfessor.data.professor },
                    token: getUserFromCookies().token,
                    role: getUserFromCookies().role,
                };
                saveUserOnCookie(updatedDataForCookie);
                dispatchUserData(loginAction(getUserFromCookies()));
                setAccountEditForm({});
            }
        }
        setIsInEditingMode(!isInEditingMode);
    };

    const handleKeypress = (e) => {
        //it triggers by pressing the enter key
        if (e.keyCode === 13) {
            handleEditButtonClick();
        }
    };

    const handleNameOnInput = (e) => {
        const nameInput = e.target.value.trim();

        if (nameInput !== "") {
            setAccountEditForm({ ...accountEditForm, name: nameInput });
        }
    };

    const handleEmailOnInput = (e) => {
        const emailInput = e.target.value.trim();

        if (emailInput !== "") {
            if (!validator.isEmail(emailInput)) {
                setIsValidEmail(false);
                setIsFormValid(false);
                return;
            }
            setIsValidEmail(true);
            setIsFormValid(isValidPassword && isValidRepeatedPassword);
            setAccountEditForm({ ...accountEditForm, email: emailInput });
        } else {
            setIsValidEmail(true);
            setIsFormValid(isValidPassword && isValidRepeatedPassword);
        }
    };

    const handlePasswordOnInput = (e) => {
        const passwordInput = e.target.value.trim();
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

        if (passwordInput !== "") {
            // console.log(passwordInput);
            if (!passwordRegex.test(passwordInput)) {
                setIsValidPassword(false);
                setIsFormValid(false);
                return;
            }
            setPassword(passwordInput);
            setIsValidPassword(true);
            setIsFormValid(isValidEmail && isValidRepeatedPassword);
            setAccountEditForm({ ...accountEditForm, password: passwordInput });
        } else {
            setPassword("");
            setIsValidPassword(true);
            setIsFormValid(isValidEmail && isValidRepeatedPassword);
        }
    };

    const handleRepeatedPasswordOnInput = (e) => {
        const repeatedPasswordInput = e.target.value.trim();

        if (repeatedPasswordInput !== password) {
            setIsValidRepeatedPassword(false);
            setIsFormValid(false);
            return;
        }
        setRepeatedPassword(repeatedPasswordInput);
        setIsValidRepeatedPassword(true);
        setIsFormValid(isValidEmail && isValidPassword);
    };

    const deleteAccount = async () => {
        await deleteProfessor(userData)
        history.push("/");        
        deleteUserFromCookie();
        dispatchUserData(logoutAction());
    };

    return (
        <main className="account-settings-container">
            <div className="account-settings-content">
                {!isInEditingMode ? (
                    <div className="account-details">
                        <p>{userData.professor.name}</p>
                        <p>{userData.professor.email}</p>
                    </div>
                ) : (
                    <>
                        <ButtonMain
                            text="Delete Account"
                            bgColor="#D62839"
                            color="#FCF7F8"
                            handleButtonClick={deleteAccount}
                        />
                        <div className="account-edit-inputs">
                            <div className="account-edit-input">
                                <label htmlFor="name">Name</label>
                                <input type="text" placeholder={userData.professor.name} onInput={handleNameOnInput} />
                            </div>
                            <div
                                className={
                                    isValidEmail
                                        ? "account-edit-input"
                                        : "account-edit-input invalid-input-account-settings"
                                }
                            >
                                <label htmlFor="email">Email</label>
                                <input
                                    type="text"
                                    placeholder={userData.professor.email}
                                    onInput={handleEmailOnInput}
                                />
                            </div>
                            <div
                                className={
                                    isValidPassword
                                        ? "account-edit-input"
                                        : "account-edit-input invalid-input-account-settings"
                                }
                            >
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter a new password..."
                                    onInput={handlePasswordOnInput}
                                />
                            </div>
                            <div
                                className={
                                    isValidRepeatedPassword
                                        ? "account-edit-input"
                                        : "account-edit-input invalid-input-account-settings"
                                }
                            >
                                <label htmlFor="repeat-password">Repeat Password</label>
                                <input
                                    type="password"
                                    placeholder="Retype your password..."
                                    onInput={handleRepeatedPasswordOnInput}
                                />
                            </div>
                        </div>
                    </>
                )}
                <ButtonMain
                    text={!isInEditingMode ? "Edit" : "Save Changes"}
                    bgColor="#FFA62B"
                    onKeyPress={handleKeypress}
                    handleButtonClick={() => handleEditButtonClick()}
                    disabled={isInEditingMode && !isFormValid}
                />
            </div>
        </main>
    );
};

export default ProfessorAccountSettings;
