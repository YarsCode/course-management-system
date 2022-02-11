import React, { useContext, useEffect, useState } from "react";

import { LoginContext } from "../../context/LoginContext";

import validator from "validator";
import ButtonMain from "../shared/ButtonMain";
import { calculateAge, formatDate } from "../../utils/formatDate";
import { deleteUserFromCookie, getUserFromCookies, saveUserOnCookie } from "../../cookies/cookies";
import { loginAction, logoutAction } from "../../actions/loginActions";
import { useHistory } from "react-router-dom";
import { editStudent, getAllExistingEmails } from "../../utils/http-requests/students/studentHttpRequests";

const StudentAccountSettings = () => {
    const { userData, dispatchUserData } = useContext(LoginContext);
    const [isInEditingMode, setIsInEditingMode] = useState(false);
    const [isValidDateOfBirth, setIsValidDateOfBirth] = useState(true);
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
            const editedStudent = await editStudent(userData, userData.student._id, accountEditForm);

            if (editedStudent) {
                const updatedDataForCookie = {
                    student: { ...editedStudent.data.student },
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

    const handleDateOfBirthOnChange = (e) => {
        const dateOfBirth = e.target.value;

        const age = calculateAge(dateOfBirth, new Date());

        if (age < 18) setIsValidDateOfBirth(false)
        else {
            setIsValidDateOfBirth(true)
            setAccountEditForm({ ...accountEditForm, dateOfBirth });
        }
    };

    const handleAddressOnInput = (e) => {
        const addressInput = e.target.value.trim();

        if (addressInput !== "") {
            setAccountEditForm({ ...accountEditForm, address: addressInput });
        }
    };

    const handleEmailOnInput = async (e) => {
        const emailInput = e.target.value.trim();

        if (emailInput !== "") {
            if (!validator.isEmail(emailInput)) {
                setIsValidEmail(false);
                setIsFormValid(false);
                return;
            }
            const emails = await getAllExistingEmails(userData);
            const doesEmailExist = emails.data.allExistingEmails.find((email) => email.email === emailInput);
            if (doesEmailExist) {
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

    return (
        <main className="account-settings-container">
            <div className="account-settings-content">
                {!isInEditingMode ? (
                    <div className="account-details">
                        <p>{userData.student.name}</p>
                        <p>{userData.student.email}</p>
                    </div>
                ) : (
                    <div className="account-edit-inputs">
                        <div className="account-edit-input">
                            <label htmlFor="name">Name</label>
                            <input type="text" placeholder={userData.student.name} onInput={handleNameOnInput} />
                        </div>
                        <div className={
                                isValidDateOfBirth
                                    ? "account-edit-input"
                                    : "account-edit-input invalid-input-account-settings"
                            }>
                            <label htmlFor="date-of-birth">Date of Birth</label>
                            <input
                                type="date"
                                name="date-of-birth"
                                defaultValue={formatDate(userData.student.dateOfBirth, "YYYY-MM-DD")}
                                onChange={handleDateOfBirthOnChange}
                            />
                        </div>
                        <div className="account-edit-input">
                            <label htmlFor="address">Address</label>
                            <input type="text" placeholder={userData.student.address} onInput={handleAddressOnInput} />
                        </div>
                        <div
                            className={
                                isValidEmail
                                    ? "account-edit-input"
                                    : "account-edit-input invalid-input-account-settings"
                            }
                        >
                            <label htmlFor="email">Email</label>
                            <input type="text" placeholder={userData.student.email} onInput={handleEmailOnInput} />
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

export default StudentAccountSettings;
