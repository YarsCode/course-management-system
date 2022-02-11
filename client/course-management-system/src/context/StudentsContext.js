import React, { createContext, useContext, useEffect, useState } from "react";
import { getAllStudents } from "../utils/http-requests/students/studentHttpRequests";
import { LoginContext } from "./LoginContext";

export const StudentsContext = createContext()

const StudentsContextProvider = (props) => {
    const { userData } = useContext(LoginContext);
    const [students, setStudents] = useState(null);
    
    const setAllStudents = async () => {
        const AllStudents = await getAllStudents(userData);
        setStudents(AllStudents.data.students);
    };
    
    useEffect(() => {
        setAllStudents()
    }, [])
    
    return (
        <StudentsContext.Provider value={ {students, setStudents, setAllStudents} }>
            { props.children }
        </StudentsContext.Provider>
    )
};

export default StudentsContextProvider;