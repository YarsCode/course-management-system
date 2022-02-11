import React, { createContext, useContext, useEffect, useState } from "react";

import { getAllCourses } from "../utils/http-requests/courses/courseHttpRequests";
import { LoginContext } from "./LoginContext";

export const CoursesContext = createContext()

const CoursesContextProvider = (props) => {
    const { userData } = useContext(LoginContext);
    
    const [courses, setCourses] = useState(null);

    // const setAllCourses = async () => {
    //     const allCourses = await getAllCourses(userData);
    //     setCourses(allCourses.data.courses);
    // };

    const setAllCourses = async () => {
        const allCourses = await getAllCourses(userData);
        // console.log(allCourses);
        // console.log(allCourses.data.courses);
        if (allCourses) setCourses(allCourses.data.courses);
        // if (allCourses) return allCourses.data.courses;
    };
    useEffect(() => {
        setAllCourses()
    }, [])
    
    return (
        <CoursesContext.Provider value={ {courses, setCourses, setAllCourses} }>
            { props.children }
        </CoursesContext.Provider>
    )
};

export default CoursesContextProvider;