import React, { useContext } from "react";

import { ClassesWithStudentContext } from "../../context/ClassesWithStudentContext";

import { LoginContext } from "../../context/LoginContext";
import Loader from "../shared/Loader";
import ClassesWithStudent from "./ClassesWithStudent";

const ManageClassAttendance = () => {
    const { userData } = useContext(LoginContext);
    const { classesWithStudent } = useContext(ClassesWithStudentContext);

    return (
        <main className="manage-class-attendance-container">
            <div className="manage-class-attendance-content">

            {!classesWithStudent ? (
                <Loader />
            ) : (
                classesWithStudent.map((classInCourse) => (
                    <div key={classInCourse.course.id} className="classes-with-student-container">
                        <h2 className="course-name">{classInCourse.course.name}</h2>
                        {classInCourse.classesWithStudent.map((classWithStudent) => (
                            <ClassesWithStudent
                                key={classWithStudent._id}
                                userData={userData}
                                classWithStudent={classWithStudent}
                            />
                        ))}
                    </div>
                ))
            )}
            </div>
        </main>
    );
};

export default ManageClassAttendance;
