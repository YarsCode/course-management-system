import React, { useContext, useEffect, useRef, useState } from "react";

import { LoginContext } from "../../context/LoginContext";
import { CoursesContext } from "../../context/CoursesContext";

import { v4 as uuidv4 } from "uuid";
import { formatDate } from "../../utils/formatDate";
import Course from "./Course";
import CourseEditForm from "./CourseEditForm";
import { deleteCourse } from "../../utils/http-requests/courses/courseHttpRequests";
import WarningModal from "../shared/WarningModal";
import Loader from "../shared/Loader";

const CoursesList = () => {
    const { userData } = useContext(LoginContext);
    const { courses, setCourses, setAllCourses } = useContext(CoursesContext);
    const bottomOfPage = useRef();
    const [isInEditMode, setIsInEditMode] = useState([]);
    const [isEditValid, setIsEditValid] = useState(true);
    const [haveAddedNewCourse, setHaveAddedNewCourse] = useState(false);

    useEffect(() => {
        if (courses) setIsInEditMode(Array(courses.length).fill(false));
    }, []);

    const renderNewCourses = () => {
        setAllCourses();
    };

    const handleEditButtonClick = (courseIndex) => {
        const newIsEditModeArray = [...isInEditMode];
        const isThereAnotherCourseAlreadyBeingEdited = newIsEditModeArray.some((e) => e);
        if (!isThereAnotherCourseAlreadyBeingEdited) {
            newIsEditModeArray[courseIndex] = !isInEditMode[courseIndex];
            setIsInEditMode(newIsEditModeArray);
        } else if (isThereAnotherCourseAlreadyBeingEdited && newIsEditModeArray[courseIndex]) {
            newIsEditModeArray[courseIndex] = !isInEditMode[courseIndex];
            setIsInEditMode(newIsEditModeArray);
        } else {
            setIsEditValid(false);
            setTimeout(() => {
                setIsEditValid(true);
            }, 2000);
        }
    };
    const newCourseTemplate = {
        _id: uuidv4(),
        name: "New Course",
        professor: { _id: userData.professor._id, name: userData.professor.name },
        startingDate: formatDate(new Date().setDate(new Date().getDate() + 1), "YYYY-MM-DD"),
        endingDate: formatDate(new Date().setDate(new Date().getDate() + 2), "YYYY-MM-DD"),
        classes: [],
    };

    const addNewCourse = async () => {
        const newIsEditModeArray = [...isInEditMode];
        const isThereAnotherCourseAlreadyBeingEdited = newIsEditModeArray.some((e) => e);
        if (!isThereAnotherCourseAlreadyBeingEdited) {
            setHaveAddedNewCourse(true);
            setIsInEditMode([...isInEditMode, true]);
            setCourses([...courses, newCourseTemplate]);
            bottomOfPage.current.scrollIntoView({ behavior: "smooth" });
        } else {
            setIsEditValid(false);
            setTimeout(() => {
                setIsEditValid(true);
            }, 2000);
        }
    };

    const deleteCourseFromList = async (course, courseIndex) => {
        if (!haveAddedNewCourse) await deleteCourse(course, userData);
        else {
            const filteredCourses = courses.filter((courseID) => courseID._id !== course._id);
            setCourses(filteredCourses);
            setHaveAddedNewCourse(false);
        }
        isInEditMode.splice(courseIndex, 1);
        setIsEditValid(true);
        renderNewCourses();
    };

    return (
        <div className="courses-list-container">
            {!courses ? (
                <Loader />
            ) : (
                <>
                    <div className="add-course-btn" onClick={addNewCourse}>
                        <i className="fa fa-plus fa-2x" aria-hidden="true" style={{ color: "#031D44" }}></i>
                    </div>
                    {courses.length > 0 ? (
                        <>
                            {courses.map((course, courseIndex) =>
                                !isInEditMode[courseIndex] ? (
                                    <Course
                                        key={course._id}
                                        course={course}
                                        courseIndex={courseIndex}
                                        handleEditButtonClick={handleEditButtonClick}
                                    />
                                ) : (
                                    <CourseEditForm
                                        key={course._id}
                                        course={course}
                                        courseIndex={courseIndex}
                                        handleEditButtonClick={handleEditButtonClick}
                                        renderNewCourses={renderNewCourses}
                                        deleteCourseFromList={deleteCourseFromList}
                                        haveAddedNewCourse={haveAddedNewCourse}
                                        setHaveAddedNewCourse={setHaveAddedNewCourse}
                                    />
                                )
                            )}
                            {!isEditValid && (
                                <WarningModal title="Invalid Operation" text="You can only edit 1 course at a time!" />
                            )}
                        </>
                    ) : (
                        <h1>No Courses!</h1>
                    )}
                    <div ref={bottomOfPage}></div>
                </>
            )}
        </div>
    );
};

export default CoursesList;
