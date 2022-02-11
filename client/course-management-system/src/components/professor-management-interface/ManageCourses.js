import React, { useContext, useState } from "react";

import { LoginContext } from "../../context/LoginContext";

import ButtonMain from "../shared/ButtonMain";
import CoursesList from "./CoursesList";
import bookPng from "../../styles/img/miscellaneous/book.png";
import StudentsList from "./StudentsList";

const ManageCourses = () => {
    const { userData } = useContext(LoginContext);
    const [isCoursesButtonClicked, setIsCoursesButtonClicked] = useState(false);
    const [isStudentsButtonClicked, setIsStudentsButtonClicked] = useState(false);

    const handleCoursesButtonClick = () => {
        setIsCoursesButtonClicked(true);
        setIsStudentsButtonClicked(false);
    };

    const handleStudentsButtonClick = () => {
        setIsStudentsButtonClicked(true);
        setIsCoursesButtonClicked(false);
    };

    const displayContent = () => {
        if (isCoursesButtonClicked) return <CoursesList />;
        if (isStudentsButtonClicked) return <StudentsList />;
        return <img src={bookPng} alt="" className="book-png" />;
    };

    return (
        <main className="manage-courses-content">
            <h1 className="welcome-message-title">Welcome back Prof. {userData.professor.name}!</h1>
            <div className="switches">
                <ButtonMain
                    bgColor="#04395E"
                    color="#FCF7F8"
                    text="Courses"
                    // padding={"1.5rem 2rem"}
                    handleButtonClick={handleCoursesButtonClick}
                />
                <ButtonMain
                    bgColor="#04395E"
                    color="#FCF7F8"
                    text="Students"
                    // padding={"1.5rem 2rem"}
                    handleButtonClick={handleStudentsButtonClick}
                />
            </div>
            {displayContent()}
        </main>
    );
};

export default ManageCourses;
