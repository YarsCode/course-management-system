import React, { useState } from "react";

import { v4 as uuidv4 } from "uuid";

import ButtonMain from "../shared/ButtonMain";
import ArrowDownSvg from "../shared/svg/ArrowDownSvg";
import ArrowUpSvg from "../shared/svg/ArrowUpSvg";
import { formatDate } from "../../utils/formatDate";


const Course = ({ course, handleEditButtonClick, courseIndex }) => {
    const [isArrowClicked, setIsArrowClicked] = useState(false);

    const handleArrowClick = () => {
        setIsArrowClicked(!isArrowClicked);
    };

    const displayAttendanceStatus = (hasAttended) => {
        if (hasAttended) return <i className="fa fa-check fa-lg" aria-hidden="true" style={{ color: "green" }}></i>;
        else return <i className="fa fa-times fa-lg" aria-hidden="true" style={{ color: "red" }}></i>;
    };

    return (
        <div className="course-container">
            <div className="course-name-title">
                <h2>{course.name}</h2>
            </div>
            <ButtonMain
                text="Edit"
                bgColor={"#FFA62B"}
                color={"#031D44"}
                handleButtonClick={() => handleEditButtonClick(courseIndex)}
            />
            <ul className="course-details-list">
                <p>Lecturer: Prof. {course.professor.name}</p>
                <p>Starts: {formatDate(course.startingDate, "D/MM/YYYY")}</p>
                <p>Ends: {formatDate(course.endingDate, "D/MM/YYYY")}</p>

                <div className="classes-list">
                    <div className={!isArrowClicked ? "upcoming-classes__title" : "upcoming-classes__title upcoming-classes__title--clicked"} onClick={handleArrowClick}>
                        <p>Upcoming Classes</p>
                        {!isArrowClicked ? (
                            <ArrowDownSvg />
                        ) : (
                            <ArrowUpSvg />
                        )}
                    </div>
                    {isArrowClicked &&
                        course.classes.map((upcomingClass) => (
                            <div className="upcoming-class" key={upcomingClass._id}>
                                <p>Date: {formatDate(upcomingClass.date, "D/MM/YYYY")}</p>
                                {upcomingClass.students.map((student) => (
                                    <div key={uuidv4()} className="student-in-class">
                                        <p>Student: {student.student.name}</p>
                                        {student.attendance !== null && (
                                            <p>Attendance: {displayAttendanceStatus(student.attendance)}</p>
                                        )}
                                        {!!student.reasonForAbsence ? <p>Reason: {student.reasonForAbsence}</p> : ""}
                                    </div>
                                ))}
                            </div>
                        ))}
                </div>
            </ul>
        </div>
    );
};

export default Course;
