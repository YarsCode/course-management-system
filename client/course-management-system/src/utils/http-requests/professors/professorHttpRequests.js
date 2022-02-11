const professorSignUp = async (data) => {
    const professor = await fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/professors/new`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then((result) => {
        // console.log(result);
        return result.json();
    });
    return professor;
}

const professorLogin = async (data) => {
    const professor = await fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/professors/login`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then((result) => {
        // console.log(result);
        return result.json();
    });
    return professor;
}

const getAllProfessors = async (professor) => {
    const professors = await fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/professors/all`, {
        method: "GET",
        mode: "cors",
        headers: {
            "Authorization": `Bearer ${professor.token}`
        }
    }).then((result) => {
        // console.log(result);
        return result.json();
    });
    return professors;
}

const editProfessor = async (professor, professorID, data) => {
    const editedProfessor = await fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/professors/me?id=${professorID}`, {
        method: "PATCH",
        mode: "cors",
        headers: {
            Authorization: `Bearer ${professor.token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then((result) => {
        // console.log(result);
        return result.json();
    });
    // console.log(courses);
    return editedProfessor;
};

const deleteProfessor = async (userData) => {
    // console.log(data, token);
    const professorToDelete = await fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/professors/me`, {
        method: "DELETE",
        mode: "cors",
        headers: {
            Authorization: `Bearer ${userData.token}`,
            "Content-Type": "application/json",
        },
    }).then((result) => {
        // console.log(result);
        return result.json();
    });
    return professorToDelete;
}

export { professorSignUp, professorLogin, getAllProfessors, editProfessor, deleteProfessor };