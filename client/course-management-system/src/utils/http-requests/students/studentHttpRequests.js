const createStudentAccount = async (data, professor) => {
    const student = await fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/students/new`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Authorization": `Bearer ${professor.token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then((result) => {
        // console.log(result);
        return result.json();
    });
    return student;
}

const studentLogin = async (data) => {
    const student = await fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/students/login`, {
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
    return student;
}

const editStudent = async (student, studentID, data) => {
    const editedStudent = await fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/students/me?id=${studentID}`, {
        method: "PATCH",
        mode: "cors",
        headers: {
            Authorization: `Bearer ${student.token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then((result) => {
        // console.log(result);
        return result.json();
    });
    // console.log(courses);
    return editedStudent;
};

const getAllStudents = async (professor) => {
    // console.log(professor);
    const students = await fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/students/all`, {
        method: "GET",
        mode: "cors",
        headers: {
            "Authorization": `Bearer ${professor.token}`
        }
    }).then((result) => {
        // console.log(result);
        return result.json();
    });
    return students;
}

const getAllExistingEmails = async (student) => {
    const emails = await fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/students/all-emails`, {
        method: "GET",
        mode: "cors",
        headers: {
            "Authorization": `Bearer ${student.token}`
        }
    }).then((result) => {
        // console.log(result);
        return result.json();
    });
    return emails;
};

const getAllClassesWithStudent = async (student) => {
    // console.log(professor);
    const classes = await fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/students/me/all-classes`, {
        method: "GET",
        mode: "cors",
        headers: {
            "Authorization": `Bearer ${student.token}`
        }
    }).then((result) => {
        // console.log(result);
        return result.json();
    });
    return classes;
}

const changeStudentAttendanceStatus = async (student, classID, data) => {
    const newAttendanceStatus = await fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/students/attendance?classID=${classID}`, {
        method: "PATCH",
        mode: "cors",
        headers: {
            Authorization: `Bearer ${student.token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then((result) => {
        // console.log(result);
        return result.json();
    });
    // console.log(courses);
    return newAttendanceStatus;
};

const deleteStudentAccount = async (studentToDelete, userData) => {
    // console.log(data, token);
    const student = await fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/students/me?id=${studentToDelete._id}`, {
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
    return student;
}

export { createStudentAccount, studentLogin, editStudent, getAllStudents, getAllExistingEmails, getAllClassesWithStudent, changeStudentAttendanceStatus, deleteStudentAccount };