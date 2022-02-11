import React, { createContext, useContext, useEffect, useState } from "react";
import { getAllClassesWithStudent } from "../utils/http-requests/students/studentHttpRequests";
import { LoginContext } from "./LoginContext";

export const ClassesWithStudentContext = createContext()

const ClassesWithStudentContextProvider = (props) => {
    const { userData } = useContext(LoginContext);
    const [classesWithStudent, setClassesWithStudent] = useState(null);
    
    const setAllClassesWithStudent = async () => {
        const allClassesWithStudent = await getAllClassesWithStudent(userData)
        setClassesWithStudent(allClassesWithStudent.data.allClassesWithStudent);
    };
    
    useEffect(() => {
        setAllClassesWithStudent()
    }, [])
    
    return (
        <ClassesWithStudentContext.Provider value={ {classesWithStudent, setClassesWithStudent, setAllClassesWithStudent } }>
            { props.children }
        </ClassesWithStudentContext.Provider>
    )
};

export default ClassesWithStudentContextProvider;