const Course = require("../models/course.model");
const Student = require("../models/student.model");
const _ = require('lodash');

const createStudent = async (req, res) => {
    const student = new Student(req.body);

    try {
        await student.save();

        console.log("A new student's account has been created successfully!");

        res.status(201).send({ status: 201, data: { student } });
    } catch (err) {
        console.log(err);
        res.status(400).send({ status: 400, message: err.message });
    }
};

const getStudent = async (req, res) => {
    const student = req.student;

    try {
        if (!student) throw new Error();

        res.send({ status: 200, data: { student } });
    } catch (err) {
        res.status(500).send({ status: 500, message: "Internal server error." });
    }
};

const getAllStudents = async (req, res) => {
    const students = await Student.find({});

    try {
        res.send({ status: 200, data: { students } });
    } catch (err) {
        res.status(500).send({ status: 500, message: err.message });
    }
};

const getAllExistingEmails = async (req, res) => {
    const students = await Student.find({});
    const allExistingEmails = _.map(students, student => _.pick(student, 'email'))

    try {
        res.send({ status: 200, data: { allExistingEmails } });
    } catch (err) {
        res.status(500).send({ status: 500, message: err.message });
    }
};

const getAllClassesWithStudent = async (req, res) => {
    const student = req.student;
    const allCoursesThatHasClassesWithStudent = await Course.find({"classes.students.student": student._id});
    const allClassesWithStudent = [];
    
    allCoursesThatHasClassesWithStudent.forEach((course, i) => {
        allClassesWithStudent.push({course: {id: course._id, name: course.name}, classesWithStudent: []});

        course.classes.forEach((classInCourse) => {
            const isClassContainsThisStudent = classInCourse.students.find(studentInClass => studentInClass.student.toString() === student._id.toString())
            if (isClassContainsThisStudent) allClassesWithStudent[i].classesWithStudent.push(classInCourse)
        })
    })
    
    try {
        res.send({ status: 200, data: { allClassesWithStudent } });
    } catch (err) {
        res.status(500).send({ status: 500, message: err.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const student = await Student.findUserByEmailAndPassowrd(email, password);

        const token = await student.generateAuthToken();

        res.send({ status: 200, data: { student, token } });
    } catch (err) {
        res.status(401).send({ status: 401, message: err.message });
    }
};

const logout = async (req, res) => {
    const student = req.student;
    const token = req.token;

    try {
        if (!student || !token) throw new Error();

        student.tokens = student.tokens.filter((thisToken) => thisToken.token !== token);
        await student.save();

        res.send({ status: 200, message: 'Logout successful.' });
    } catch (err) {
        res.status(500).send({ status: 500, message: 'Internal server error.' });
    }
};

const logoutFromAllDevices = async (req, res) => {
    const student = req.student;

    try {
        if (!student) throw new Error();

        student.tokens = [];
        await student.save();

        res.send({ status: 200, message: 'Logout from all devices successful.' });
    } catch (err) {
        res.status(500).send({ status: 500, message: 'Internal server error.' });
    }
};

const editStudent = async (req, res) => {
    const edits = Object.keys(req.body);
    const allowedEdits = ['name', 'dateOfBirth', 'address', 'email', 'password'];
    const areEditsValid = edits.every((edit) => allowedEdits.includes(edit));

    if (!areEditsValid) return res.status(400).send({ status: 400, message: 'Edits are not valid.' });

    const student = req.student;

    try {
        if (!student) return res.status(500).send({ status: 500, message: 'Internal server error.' });

        edits.forEach((edit) => (student[edit] = req.body[edit]));
        await student.save();

        res.send({ status: 200, message: 'Account information updated.', data: { student } });
    } catch (err) {
        res.status(501).send({ status: 501, message: err });
    }
};

const changeAttendanceStatus = async (req, res) => {
    const student = req.student;
    const classID = req.query.classID;
    const courseWithThisClass = await Course.findOne({"classes._id": classID});
    const classToEdit = courseWithThisClass.classes.find(thisClass => thisClass.id === classID); // Gets the class inside the course
    const studentInClass = classToEdit.students.find(studentToEdit => studentToEdit.student.toString() === student.id); // Gets the student inside the class
    
    const edits = Object.keys(req.body);
    const allowedEdits = ['attendance', 'reasonForAbsence'];
    const areEditsValid = edits.every((edit) => allowedEdits.includes(edit));

    if (!areEditsValid) return res.status(400).send({ status: 400, message: 'Edits are not valid.' });

    try {
        if (!student || !courseWithThisClass || !classToEdit || !studentInClass) return res.status(500).send({ status: 500, message: 'Internal server error.' });

        edits.forEach((edit) => (studentInClass[edit] = req.body[edit]));
        await courseWithThisClass.save();   
        
        res.send({ status: 200, message: 'Attendance status changed.', data: { studentInClass } });
    } catch (err) {
        res.status(501).send({ status: 501, message: err });
    }
};

const deleteStudent = async (req, res) => {
    // const student = req.student;
    const studentID = req.query.id;
    const student = await Student.findById(studentID);

    try {
        if (!student) throw new Error();

        await student.remove();

        console.log("Student's account has been deleted successfully!");

        res.send({ status: 200, message: "Student's account has been deleted successfully!" });
    } catch (err) {
        res.status(500).send({ status: 500, message: 'Internal server error.' });
    }
};

module.exports = { createStudent, getStudent, getAllStudents, getAllExistingEmails, getAllClassesWithStudent, login, logout, logoutFromAllDevices, editStudent, changeAttendanceStatus, deleteStudent };
