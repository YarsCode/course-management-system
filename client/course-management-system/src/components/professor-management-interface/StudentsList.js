import React, { useContext, useReducer, useState } from "react";

import studentEditReducer, { EDIT_FORM_INITIAL_STATE } from "../../reducers/studentEditReducer";
import { updateInputAction } from "../../actions/studentEditActions";
import studentEditTypes from "../../action-types/studentEditTypes";

import validator from "validator";
import { formatDate, calculateAge } from "../../utils/formatDate";
import { StudentsContext } from "../../context/StudentsContext";
import ButtonMain from "../shared/ButtonMain";
import { LoginContext } from "../../context/LoginContext";
import { createStudentAccount, deleteStudentAccount } from "../../utils/http-requests/students/studentHttpRequests";
import { CoursesContext } from "../../context/CoursesContext";
import Loader from "../shared/Loader";

const StudentsList = () => {
    const { userData } = useContext(LoginContext);
    const { students, setAllStudents } = useContext(StudentsContext);
    const { setAllCourses } = useContext(CoursesContext);
    const [formState, dispatchFormState] = useReducer(studentEditReducer, EDIT_FORM_INITIAL_STATE);

    const [isStudentBeingCreated, setIsStudentBeingCreated] = useState(false);
    const [isSeePassIconClicked, setIsSeePassIconClicked] = useState(false);
    const [isSeeRepeatedPassIconClicked, setIsSeeRepeatedPassIconClicked] = useState(false);

    const createNewStudent = () => {
        setIsStudentBeingCreated(true);
        const newStudents = [...students];
        newStudents.push();
    };

    const handleNameOnInput = (e) => {
        const nameInput = e.target.value.trim();

        if (nameInput === "") {
            // console.log(nameInput);
            return dispatchFormState(
                updateInputAction(studentEditTypes.EDIT_NAME, nameInput, false, "Please enter a name.")
            );
        }

        dispatchFormState(updateInputAction(studentEditTypes.EDIT_NAME, nameInput, true));
    };

    const handleBirthdateChange = (e) => {
        const age = calculateAge(e.target.value, new Date());

        if (age < 18) {
            return dispatchFormState(
                updateInputAction(
                    studentEditTypes.EDIT_BIRTHDATE,
                    e.target.value,
                    false,
                    "Student must be at least 18 years old."
                )
            );
        }

        dispatchFormState(updateInputAction(studentEditTypes.EDIT_BIRTHDATE, e.target.value, true));
    };

    const handleAddressOnInput = (e) => {
        const addressInput = e.target.value.trim();

        if (addressInput === "") {
            // console.log(addressInput);
            return dispatchFormState(
                updateInputAction(studentEditTypes.EDIT_ADDRESS, addressInput, false, "Please enter an address.")
            );
        }

        dispatchFormState(updateInputAction(studentEditTypes.EDIT_ADDRESS, addressInput, true));
    };

    const handleEmailOnInput = (e) => {
        const emailInput = e.target.value.trim().toLowerCase();

        if (!validator.isEmail(emailInput)) {
            return dispatchFormState(
                updateInputAction(studentEditTypes.EDIT_EMAIL, emailInput, false, "Please enter a valid email address.")
            );
        }
        const existingEmail = students.find((student) => student.email === emailInput);

        if (existingEmail) {
            return dispatchFormState(
                updateInputAction(studentEditTypes.EDIT_EMAIL, emailInput, false, "Email is already taken.")
            );
        }

        dispatchFormState(updateInputAction(studentEditTypes.EDIT_EMAIL, emailInput, true));
    };

    const handlePasswordOnInput = (e) => {
        const passwordInput = e.target.value.trim();
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

        if (!passwordRegex.test(passwordInput)) {
            return dispatchFormState(
                updateInputAction(
                    studentEditTypes.EDIT_PASSWORD,
                    passwordInput,
                    false,
                    "Password must containt at least 8 characters, 1 uppercase and 1 lowercase, and a number."
                )
            );
        }

        dispatchFormState(updateInputAction(studentEditTypes.EDIT_PASSWORD, passwordInput, true));
    };

    const handleRepeatedPasswordOnInput = (e) => {
        const repeatedPasswordInput = e.target.value.trim();
        const passwordState = formState.values.password;

        if (repeatedPasswordInput !== passwordState) {
            return dispatchFormState(
                updateInputAction(
                    studentEditTypes.EDIT_REPEATED_PASSWORD,
                    repeatedPasswordInput,
                    false,
                    "Passwords doesn't match."
                )
            );
        }

        dispatchFormState(updateInputAction(studentEditTypes.EDIT_REPEATED_PASSWORD, repeatedPasswordInput, true));
    };

    const deleteStudent = async (studentIndex) => {
        // const newStudents = [...students];
        // delete newStudents[studentIndex]
        if (!isStudentBeingCreated) {
            await deleteStudentAccount(students[studentIndex], userData);
            setAllStudents();
            setAllCourses();
        } else setIsStudentBeingCreated(false); // Deletes the new student form
    };

    const onSubmitForm = async (e) => {
        e.preventDefault();

        const data = { ...formState.values };
        delete data.repeatedPassword;

        await createStudentAccount(data, userData);
        setAllStudents();
        setIsStudentBeingCreated(false);
    };

    return (
        <div className="students-list">
            {!students ? (
                <Loader />
            ) : (
                <>
                    <div className="create-student-btn" onClick={createNewStudent}>
                        <i className="fa fa-plus fa-lg" aria-hidden="true" style={{ color: "#FCF7F8" }}></i>
                    </div>
                    {students.length > 0 ? (
                        <div className="students">
                            {students.map((student, studentIndex) => (
                                <div className="student" key={student._id}>
                                    <i
                                        className="fa fa-trash fa-lg student-trash-icon"
                                        aria-hidden="true"
                                        onClick={() => deleteStudent(studentIndex)}
                                    ></i>
                                    <p>{student.name}</p>
                                    <p>
                                        Birth Date: <br />
                                        {formatDate(student.dateOfBirth, "YYYY-MM-DD")}
                                    </p>
                                    <p>Address: {student.address}</p>
                                    <p>Email: {student.email}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        !isStudentBeingCreated && <h1>No Students!</h1>
                    )}
                    {isStudentBeingCreated && (
                        <div className="student">
                            <i
                                className="fa fa-trash fa-lg student-trash-icon"
                                aria-hidden="true"
                                onClick={() => deleteStudent()}
                            ></i>
                            <form className="edit-new-student-form" onSubmit={onSubmitForm}>
                                <fieldset
                                    className={
                                        !formState.validities.isNameValid
                                            ? "edit-student-form-fieldset invalid-fieldset"
                                            : "edit-student-form-fieldset"
                                    }
                                >
                                    <legend htmlFor="name">Name</legend>
                                    {!formState.validities.isNameValid && (
                                        <div className="invalid-input-message">
                                            {formState.errorMessages.nameErrorMessage}
                                        </div>
                                    )}
                                    <input type="text" id="name" name="name" onInput={handleNameOnInput} />
                                </fieldset>
                                <fieldset
                                    className={
                                        !formState.validities.isDateOfBirthValid
                                            ? "edit-student-form-fieldset invalid-fieldset"
                                            : "edit-student-form-fieldset"
                                    }
                                >
                                    <legend htmlFor="birthdate">Birth Date</legend>
                                    {!formState.validities.isDateOfBirthValid && (
                                        <div className="invalid-input-message">
                                            {formState.errorMessages.dateOfBirthErrorMessage}
                                        </div>
                                    )}
                                    <input
                                        type="date"
                                        id="birthdate"
                                        name="birthdate"
                                        defaultValue={formatDate(new Date(), "YYYY-MM-DD")}
                                        onInput={handleBirthdateChange}
                                    />
                                </fieldset>
                                <fieldset
                                    className={
                                        !formState.validities.isAddressValid
                                            ? "edit-student-form-fieldset invalid-fieldset"
                                            : "edit-student-form-fieldset"
                                    }
                                >
                                    <legend htmlFor="address">Address</legend>
                                    {!formState.validities.isAddressValid && (
                                        <div className="invalid-input-message">
                                            {formState.errorMessages.addressErrorMessage}
                                        </div>
                                    )}
                                    <input type="text" id="address" name="address" onInput={handleAddressOnInput} />
                                </fieldset>
                                <fieldset
                                    className={
                                        !formState.validities.isEmailValid
                                            ? "edit-student-form-fieldset invalid-fieldset"
                                            : "edit-student-form-fieldset"
                                    }
                                >
                                    <legend htmlFor="email">Email</legend>
                                    {!formState.validities.isEmailValid && (
                                        <div className="invalid-input-message">
                                            {formState.errorMessages.emailErrorMessage}
                                        </div>
                                    )}
                                    <input type="text" id="email" name="email" onInput={handleEmailOnInput} />
                                </fieldset>
                                <fieldset
                                    className={
                                        !formState.validities.isPasswordValid
                                            ? "edit-student-form-fieldset edit-student-password invalid-fieldset"
                                            : "edit-student-form-fieldset edit-student-password"
                                    }
                                >
                                    <legend htmlFor="password">Password</legend>
                                    {!formState.validities.isPasswordValid && (
                                        <div className="invalid-input-message">
                                            {formState.errorMessages.passwordErrorMessage}
                                        </div>
                                    )}
                                    <input
                                        type={isSeePassIconClicked ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        onInput={handlePasswordOnInput}
                                    />
                                    <i
                                        className="fa fa-eye fa-lg"
                                        style={{ color: "#FCF7F8" }}
                                        aria-hidden="true"
                                        onClick={() => setIsSeePassIconClicked(!isSeePassIconClicked)}
                                    ></i>
                                </fieldset>
                                <fieldset
                                    className={
                                        !formState.validities.isRepeatedPasswordValid
                                            ? "edit-student-form-fieldset edit-student-password invalid-fieldset"
                                            : "edit-student-form-fieldset edit-student-password"
                                    }
                                >
                                    <legend htmlFor="passwordRepeat">Repeat Password</legend>
                                    {!formState.validities.isRepeatedPasswordValid && (
                                        <div className="invalid-input-message">
                                            {formState.errorMessages.repeatedPasswordErrorMessage}
                                        </div>
                                    )}
                                    <input
                                        type={isSeeRepeatedPassIconClicked ? "text" : "password"}
                                        id="passwordRepeat"
                                        name="passwordRepeat"
                                        onInput={handleRepeatedPasswordOnInput}
                                    />
                                    <i
                                        className="fa fa-eye fa-lg"
                                        style={{ color: "#FCF7F8" }}
                                        aria-hidden="true"
                                        onClick={() => setIsSeeRepeatedPassIconClicked(!isSeeRepeatedPassIconClicked)}
                                    ></i>
                                </fieldset>

                                <ButtonMain
                                    type="submit"
                                    text="Save"
                                    bgColor="#FFA62B"
                                    width="60%"
                                    disabled={!formState.isFormValid}
                                />
                            </form>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default StudentsList;
