import React, { useContext, useRef, useState } from "react";
import { ClassesWithStudentContext } from "../../context/ClassesWithStudentContext";

import { formatDate } from "../../utils/formatDate";
import { changeStudentAttendanceStatus } from "../../utils/http-requests/students/studentHttpRequests";
import ButtonMain from "../shared/ButtonMain";

const ClassesWithStudent = ({ userData, classWithStudent }) => {
    const { setAllClassesWithStudent } = useContext(ClassesWithStudentContext);
    const [hasStudentMissedClass, setHasStudentMissedClass] = useState(false);
    const [isReasonForAbsenceValid, setIsReasonForAbsenceValid] = useState(false);
    const reasonForAbsence = useRef();

    const hasClassDatePassed = (classDate) => {
        const today = new Date();
        return today > Date.parse(classDate);
    };

    const handleAttendedStudent = async (classWithStudent) => {
        const newAttendanceStatus = { attendance: true };

        await changeStudentAttendanceStatus(userData, classWithStudent._id, newAttendanceStatus);
        setAllClassesWithStudent();
    };

    const handleMissedStudentOnSubmit = async (classWithStudent) => {
        const newAttendanceStatus = { attendance: false, reasonForAbsence: reasonForAbsence.current.value };

        await changeStudentAttendanceStatus(userData, classWithStudent._id, newAttendanceStatus);
        setAllClassesWithStudent();
    };

    const reasonForAbsenceOnChangeHandler = () => {
        if (reasonForAbsence.current.value.trim() === "") setIsReasonForAbsenceValid(false);
        else setIsReasonForAbsenceValid(true);
    };

    const haveStudentAlreadyUpdatedAttendanceStatus = () => {
        const currentStudent = classWithStudent.students.find((student) => student.student === userData.student._id);
        
        if (currentStudent.attendance != null) return true;
        else return false;
    };

    const getStudentFromClass = (classWithStudent) => {
        const currentStudent = classWithStudent.students.find((student) => student.student === userData.student._id);

        return currentStudent;
    };

    const hasStudentAttendedClass = (classWithStudent) => {
        const currentStudent = classWithStudent.students.find((student) => student.student === userData.student._id);
        // console.log(currentStudent);

        return currentStudent.attendance;
    };

    return (
        <div className="classes-with-student-content">
            <p>Class Date: {formatDate(classWithStudent.date, "DD/MM/YYYY HH:mm")}</p>
            {!hasClassDatePassed(classWithStudent.date) ? (
                <></>
            ) : !haveStudentAlreadyUpdatedAttendanceStatus() ? (
                <div className="attendance-buttons-and-reason-container">
                    <div>
                        <button
                            className="student-attended-class"
                            onClick={() => handleAttendedStudent(classWithStudent)}
                        >
                            Attended
                        </button>
                        <button
                            className={hasStudentMissedClass ? "student-missed-class--clicked" : "student-missed-class"}
                            onClick={() => setHasStudentMissedClass(true)}
                        >
                            Missed
                        </button>
                    </div>
                    {hasStudentMissedClass && (
                        <div className="reason-for-absence">
                            <textarea
                                name="reason-for-absence"
                                id="reason-for-absence"
                                ref={reasonForAbsence}
                                cols="30"
                                rows="10"
                                placeholder="Please specify the reason for your absence from class..."
                                onChange={reasonForAbsenceOnChangeHandler}
                            ></textarea>
                            <ButtonMain
                                text="Submit"
                                bgColor={"#FFA62B"}
                                color={"#031D44"}
                                handleButtonClick={() => handleMissedStudentOnSubmit(classWithStudent)}
                                disabled={!isReasonForAbsenceValid}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {hasStudentAttendedClass(classWithStudent) ? (
                        <i className="fa fa-check fa-lg" aria-hidden="true" style={{ color: "green" }}></i>
                    ) : (
                        <div className="missed-class-icon-and-reason">
                            <i className="fa fa-times fa-lg" aria-hidden="true" style={{ color: "red" }}></i>
                            <p>{getStudentFromClass(classWithStudent).reasonForAbsence}</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ClassesWithStudent;
