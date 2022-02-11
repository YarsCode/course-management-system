import _ from "lodash";
import omitDeep from "omit-deep-lodash";

const getAllCourses = async (data) => {
    const courses = await fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/courses/all`, {
        method: "GET",
        mode: "cors",
        headers: {
            Authorization: `Bearer ${data.token}`,
        },
    }).then((result) => {
        // console.log(result);
        return result.json();
    });
    // console.log(courses);
    return courses;
};

const editCourse = async (professor, course, courseID) => {
    const editedCourse = await fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/courses/course?id=${courseID}`, {
        method: "PATCH",
        mode: "cors",
        headers: {
            Authorization: `Bearer ${professor.token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(course),
    }).then((result) => {
        // console.log(result);
        return result.json();
    });
    // console.log(courses);
    return editedCourse;
};

const createNewCourse = async (data, userData) => {
    const course = await fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/courses/new`, {
        method: "POST",
        mode: "cors",
        headers: {
            Authorization: `Bearer ${userData.token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then((result) => {
        // console.log(result);
        return result.json();
    });
    return course;
}

const deleteCourse = async (data, userData) => {
    // console.log(data, token);
    const course = await fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/courses/course?id=${data._id}`, {
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
    return course;
}

export { getAllCourses, createNewCourse, editCourse, deleteCourse };
