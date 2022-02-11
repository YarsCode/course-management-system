import React, { useContext, useEffect, useRef, useState } from "react";

import { v4 as uuidv4 } from "uuid";
import _ from "lodash";

import { LoginContext } from "../../context/LoginContext";
import { ProfessorsContext } from "../../context/ProfessorsContext";
import { StudentsContext } from "../../context/StudentsContext";
import { CoursesContext } from "../../context/CoursesContext";

import { formatDate } from "../../utils/formatDate";
import { createNewCourse, editCourse } from "../../utils/http-requests/courses/courseHttpRequests";
import ButtonMain from "../shared/ButtonMain";

const CourseEditForm = ({
    course,
    handleEditButtonClick,
    courseIndex,
    renderNewCourses,
    deleteCourseFromList,
    haveAddedNewCourse,
    setHaveAddedNewCourse,
}) => {
    const { userData } = useContext(LoginContext);
    const { professors } = useContext(ProfessorsContext);
    const { students } = useContext(StudentsContext);
    const { setCourses, setAllCourses } = useContext(CoursesContext);

    const [courseForm, setCourseForm] = useState(course);
    const [isCourseNameValid, setIsCourseNameValid] = useState(true);
    const [professorInCourse, setProfessorInCourse] = useState(course.professor);
    const [isStartingDateValid, setIsStartingDateValid] = useState(true);
    const [isEndingDateValid, setIsEndingDateValid] = useState(true);
    const [areThereAnyClassesWithNoStudents, setAreThereAnyClassesWithNoStudents] = useState(false);
    const [areThereAnyStudentDuplicatesInClassState, setAreThereAnyStudentDuplicatesInClassState] = useState(false);
    const [isClassesDateValid, setIsClassesDateValid] = useState(areClassesDatesValid());
    const startingDate = useRef(null);
    const endingDate = useRef(null);
    const [isFormValid, setIsFormValid] = useState(setFormValidity());

    useEffect(() => {
        handleFormValidation();
    }, [
        isCourseNameValid,
        isStartingDateValid,
        isEndingDateValid,
        courseForm.classes,
        isClassesDateValid,
        areThereAnyClassesWithNoStudents,
        areThereAnyStudentDuplicatesInClassState
    ]);

    // function studentsInClassInit(classes) {
    //     const transformedArray = [];
    //     classes.forEach((thisClass) => {
    //         transformedArray.push([...thisClass.students]);
    //     });
    //     return transformedArray;
    // }
    function setFormValidity() {
        if (isCourseNameValid && isStartingDateValid && isEndingDateValid && !areThereAnyClassesWithNoStudents && !areThereAnyStudentDuplicatesInClassState) {
            return true;
        }
        return false;
    }

    function areClassesDatesValid() {
        const today = new Date();
        const areDatesValidForEachClass = [];
        courseForm.classes.forEach((classAtCourse) => {
            areDatesValidForEachClass.push(Date.parse(classAtCourse.date) > today);
        });
        return areDatesValidForEachClass;
    }

    const handleFormValidation = () => {
        startingDateValidation();
        endingDateValidation();
        studentsInClassValidation();
        const areAllClassesDatesValid = isClassesDateValid.every((isValidDate) => isValidDate);
        // console.log(courseForm.classes);
        // console.log("areThereAnyClassesWithNoStudents: " + areThereAnyClassesWithNoStudents);
        // console.log("areAllClassesDatesValid: " + areAllClassesDatesValid);
        // console.log("isFormValid: " + (isCourseNameValid && isStartingDateValid && isEndingDateValid && areThereAnyClassesWithNoStudents && areAllClassesDatesValid));
        setIsFormValid(
            isCourseNameValid &&
                isStartingDateValid &&
                isEndingDateValid &&
                !areThereAnyClassesWithNoStudents &&
                !areThereAnyStudentDuplicatesInClassState &&
                areAllClassesDatesValid
        );
    };

    const handleCourseNameInputChange = (e) => {
        // setCourseName(e.target.value);
        if (e.target.value === "") {
            setIsCourseNameValid(false);
        } else {
            setCourseForm({ ...courseForm, name: e.target.value });
            setIsCourseNameValid(true);
        }
        // setCourseForm({ ...courseForm, name: courseName});
    };

    const handleProfessorInputChange = (e) => {
        // console.log(e.target.options);
        const selectedProfessorHTML = Array.apply(null, e.target.options).find((professor) => professor.selected);
        const selectedProfessor = { _id: selectedProfessorHTML.id, name: e.target.value };
        // console.log(selectedProfessorHTML);
        // console.log(selectedProfessor);
        setProfessorInCourse(selectedProfessor);
        // console.log(professorInCourse);
        setCourseForm({ ...courseForm, professor: selectedProfessor });
    };

    const startingDateValidation = () => {
        const today = new Date();

        if (Date.parse(startingDate.current.value) >= Date.parse(endingDate.current.value)) setIsStartingDateValid(false);
        else {
            setIsStartingDateValid(true);
            setCourseForm({ ...courseForm, startingDate: startingDate.current.value });
        }

        // Date.parse(startingDate.current.value) < today ? setIsStartingDateValid(false) : setIsStartingDateValid(true);
    };

    const endingDateValidation = () => {
        if (Date.parse(endingDate.current.value) <= Date.parse(startingDate.current.value)) setIsEndingDateValid(false);
        else {
            setIsEndingDateValid(true);
            setCourseForm({ ...courseForm, endingDate: endingDate.current.value });
        }
        // Date.parse(endingDate.current.value) <= Date.parse(startingDate.current.value)
        //     ? setIsEndingDateValid(false)
        //     : setIsEndingDateValid(true);
    };

    const addNewClass = () => {
        const newClasses = [...courseForm.classes];
        const newClassTemplate = {
            date: formatDate(new Date().setDate(new Date().getDate() + 1), "YYYY-MM-DD"),
            students: [],
            _id: uuidv4(),
        };
        newClasses.push(newClassTemplate);

        setIsClassesDateValid([...isClassesDateValid, true]);
        setCourseForm({ ...courseForm, classes: newClasses });
        // setClasses([...newClasses])
    };

    const removeClass = (classToRemove, classIndex) => {
        const newClasses = courseForm.classes.filter((thisClass) => thisClass !== classToRemove);
        const newIsClassesDateValid = [...isClassesDateValid];
        newIsClassesDateValid.splice(classIndex, 1);
        setIsClassesDateValid(newIsClassesDateValid);

        setCourseForm({ ...courseForm, classes: newClasses });
    };

    const studentsInClassValidation = () => {
        const newAreThereAnyClassesWithNoStudents = courseForm.classes.some(
            (classInCourse) => classInCourse.students.length < 1
        );
        setAreThereAnyClassesWithNoStudents(newAreThereAnyClassesWithNoStudents);
        // console.log(courseForm.classes);
    };

    const classDateValidation = (date, classIndex) => {
        const today = new Date();
        const newClassesDates = [...isClassesDateValid];

        // If the date of the class is after today's date => set it as true (valid)
        newClassesDates[classIndex] = Date.parse(date) > today;
        setIsClassesDateValid(newClassesDates);
        // console.log(newClassesDates);
        return newClassesDates;
    };

    const changeClassDate = (e, classIndex) => {
        const newClassesDates = classDateValidation(e.target.value, classIndex);
        // const today = new Date();
        // const areClassesDatesValid = ;
        // console.log(newClassesDates);
        // console.log(classIndex);
        // Date.parse(e.target.value) < today ? setIsClassesDateValid(isClassesDateValid[classIndex] = false) : setIsClassesDateValid(true);

        if (newClassesDates[classIndex]) {
            const updatedClassDate = [...courseForm.classes];
            updatedClassDate[classIndex].date = e.target.value;
            // console.log(updatedClassDate);
            setCourseForm({ ...courseForm, classes: updatedClassDate });
        }
    };

    const addNewStudentToClass = (classIndex) => {
        const newStudentTemplate = {
            student: _.pick(students[0], "_id", "name"),
            attendance: null,
            reasonForAbsence: null,
        };
        const newClasses = [...courseForm.classes];
        newClasses[classIndex].students.push(newStudentTemplate);

        if (areThereAnyStudentDuplicatesInClass(classIndex)) setAreThereAnyStudentDuplicatesInClassState(true)
        else setAreThereAnyStudentDuplicatesInClassState(false)

        // Updates the form with the new data about the students inside the classes
        setCourseForm({ ...courseForm, classes: newClasses });
    };

    const deleteStudentFromClass = (studentToDelete, classIndex) => {
        const newClasses = [...courseForm.classes];
        newClasses[classIndex].students = newClasses[classIndex].students.filter(
            (student) => student !== studentToDelete
        );

        if (areThereAnyStudentDuplicatesInClass(classIndex)) setAreThereAnyStudentDuplicatesInClassState(true)
        else setAreThereAnyStudentDuplicatesInClassState(false)

        // Updates the form with the new data about the students inside the classes
        setCourseForm({ ...courseForm, classes: newClasses });
    };

    const areThereAnyStudentDuplicatesInClass = (classIndex) => {
        const allStudentsInClass = courseForm.classes[classIndex].students.map((student) => {return student.student._id});
        let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) !== index)

        return findDuplicates(allStudentsInClass).length > 0
    };

    const changeStudentInClass = (e, classIndex, student) => {
        const selectedStudent = [...e.target.children].find(student => student.selected);
        const newClasses = [...courseForm.classes];
        const studentToChange = courseForm.classes[classIndex].students.find(a => a.student === student.student);
        studentToChange.student = {_id: selectedStudent.id, name: selectedStudent.value};
        if (areThereAnyStudentDuplicatesInClass(classIndex)) setAreThereAnyStudentDuplicatesInClassState(true)
        else {
            setAreThereAnyStudentDuplicatesInClassState(false)
            setCourseForm({ ...courseForm, classes: newClasses });
        }
    };

    const onSubmitForm = async (e) => {
        e.preventDefault();
        handleEditButtonClick(courseIndex);
        const transformedData = _.omit(courseForm, "updatedAt", "createdAt", "_id", "__v");
        transformedData.classes.forEach((thisClass) => {
            delete thisClass._id;
        });
        // console.log(transformedData);
        if (!haveAddedNewCourse) await editCourse(userData, transformedData, courseForm._id);
        else {
            await createNewCourse(transformedData, userData);
            setHaveAddedNewCourse(false);
        }
        renderNewCourses();
    };

    return (
        <form className="course-container" onSubmit={onSubmitForm}>
            <div className="title-and-remove-btn">
                <h2>
                    <input
                        type="text"
                        defaultValue={courseForm.name}
                        id="course-name"
                        name="course-name"
                        className={isCourseNameValid ? "edit-course-title" : "edit-course-title invalid-input"}
                        onChange={handleCourseNameInputChange}
                    />
                </h2>

                <i
                    className="fa fa-trash fa-lg trash-icon"
                    aria-hidden="true"
                    onClick={() => deleteCourseFromList(course, courseIndex)}
                ></i>
            </div>
            <ButtonMain text="Save" bgColor={"#FFA62B"} color={"#031D44"} type="submit" disabled={!isFormValid} />
            <div className="course-details-list">
                <div className="edit-form-inputs">
                    <fieldset className="course-edit-form-fieldset">
                        <legend htmlFor="professor-name">Lecturer</legend>
                        <select
                            name="professor-name"
                            id={course.professor._id}
                            defaultValue={course.professor.name}
                            className="professors-select"
                            onChange={handleProfessorInputChange}
                        >
                            {professors &&
                                professors.map((professor) => (
                                    <option key={professor._id} defaultValue={professor.name} id={professor._id}>
                                        {professor.name}
                                    </option>
                                ))}
                        </select>
                    </fieldset>
                    <fieldset
                        className={
                            isStartingDateValid
                                ? "course-edit-form-fieldset"
                                : "course-edit-form-fieldset invalid-fieldset"
                        }
                    >
                        <legend htmlFor="starting-date">Starts</legend>
                        {!isStartingDateValid && (
                            <p className="invalid-fieldset-message">Starting date can't be later than the ending</p>
                        )}
                        <input
                            type="date"
                            id="starting-date"
                            name="starting-date"
                            className="starting-date-input"
                            defaultValue={formatDate(course.startingDate, "YYYY-MM-DD")}
                            onChange={startingDateValidation}
                            ref={startingDate}
                        />
                    </fieldset>
                    <fieldset
                        className={
                            isStartingDateValid && isEndingDateValid
                                ? "course-edit-form-fieldset"
                                : "course-edit-form-fieldset invalid-fieldset"
                        }
                    >
                        <legend htmlFor="ending-date">Ends</legend>
                        {(!isStartingDateValid || !isEndingDateValid) && (
                            <p className="invalid-fieldset-message">Ending date can't be before starting date</p>
                        )}
                        <input
                            type="date"
                            id="ending-date"
                            name="ending-date"
                            className="ending-date-input"
                            defaultValue={formatDate(course.endingDate, "YYYY-MM-DD")}
                            onChange={endingDateValidation}
                            ref={endingDate}
                        />
                    </fieldset>
                </div>

                <div className="classes-list">
                    <div className="upcoming-classes__title">
                        <p>Upcoming Classes</p>
                    </div>
                    {courseForm.classes.map((upcomingClass, classIndex) => (
                        <div className="upcoming-class" key={upcomingClass._id}>
                            <i
                                className="fa fa-trash fa-sm class-trash-icon"
                                aria-hidden="true"
                                onClick={() => removeClass(upcomingClass, classIndex)}
                            ></i>
                            <div className="edit-form-inputs">
                                <fieldset
                                    className={
                                        isClassesDateValid[classIndex]
                                            ? "edit-class-fieldset"
                                            : "edit-class-fieldset invalid-fieldset"
                                    }
                                >
                                    <legend htmlFor="date">Date</legend>
                                    {!isClassesDateValid[classIndex] && (
                                        <p className="invalid-fieldset-message">Invalid class date</p>
                                    )}
                                    <input
                                        type="datetime-local"
                                        id="date"
                                        name="date"
                                        defaultValue={formatDate(upcomingClass.date, "YYYY-MM-DDTHH:mm")}
                                        onChange={(event) => changeClassDate(event, classIndex)}
                                        // ref={startingDate}
                                    />
                                </fieldset>
                                <fieldset
                                    className={
                                        upcomingClass.students.length < 1 || areThereAnyStudentDuplicatesInClassState
                                            ? "edit-student-in-class-fieldset invalid-fieldset"
                                            : "edit-student-in-class-fieldset"
                                    }
                                >
                                    {upcomingClass.students.length < 1 && (
                                        <p className="invalid-fieldset-message">
                                            Class has to have at least 1 student!
                                        </p>
                                    )}
                                    {areThereAnyStudentDuplicatesInClassState && (
                                        <p className="invalid-fieldset-message">
                                            Having duplicate students is impossible!
                                        </p>
                                    )}
                                    <legend htmlFor="student">Students</legend>
                                    {students ? (
                                        courseForm.classes[classIndex].students.map((student) => (
                                            <div className="student-delete-btn-container" key={uuidv4()}>
                                                {areThereAnyStudentDuplicatesInClass(classIndex)}
                                                <i
                                                    className="fa fa-times fa-sm delete-student"
                                                    aria-hidden="true"
                                                    onClick={() => deleteStudentFromClass(student, classIndex)}
                                                ></i>
                                                <select
                                                    name="student"
                                                    id="student"
                                                    className="student-select"
                                                    defaultValue={student.student.name}
                                                    onChange={(e) => changeStudentInClass(e, classIndex, student)}
                                                >
                                                    {students.map((student) => (
                                                        <option key={uuidv4()} id={student._id} value={student.name}>
                                                            {student.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        ))
                                    ) : (
                                        <h4>No Students!</h4>
                                    )}
                                    {students.length > 0 && <div className="add-student-btn" onClick={() => addNewStudentToClass(classIndex)}>
                                        <i className="fa fa-plus" aria-hidden="true" style={{ color: "#FCF7F8" }}></i>
                                    </div>}
                                </fieldset>
                            </div>
                        </div>
                    ))}
                    <div className="add-class-btn" onClick={addNewClass}>
                        <i className="fa fa-plus fa-lg" aria-hidden="true" style={{ color: "#FCF7F8" }}></i>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default CourseEditForm;
