import React, { createContext, useContext, useEffect, useState } from "react";
import { getAllProfessors } from "../utils/http-requests/professors/professorHttpRequests";
import { LoginContext } from "./LoginContext";

export const ProfessorsContext = createContext()

const ProfessorsContextProvider = (props) => {
    const { userData } = useContext(LoginContext);
    const [professors, setProfessors] = useState(null);

    const setAllProfessors = async () => {
        const allProfessors = await getAllProfessors(userData);
        setProfessors(allProfessors.data.professors);
    };
    
    useEffect(() => {
        setAllProfessors()
    }, [])
    
    return (
        <ProfessorsContext.Provider value={ {professors, setProfessors} }>
            { props.children }
        </ProfessorsContext.Provider>
    )
};

export default ProfessorsContextProvider;