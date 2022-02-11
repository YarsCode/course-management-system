const Course = require("../models/course.model");

const createCourse = async (req, res) => {
    const course = new Course(req.body);

    try {
        await course.populate('professor')
        await course.save();

        console.log("A new course has been created successfully!");

        res.status(201).send({ status: 201, data: { course } });
    } catch (err) {
        console.log(err);
        res.status(400).send({ status: 400, message: err.message });
    }
};

const getCourse = async (req, res) => {
    const courseID = req.query.id;
    const course = await Course.findById(courseID);
    // console.log(course);
    
    try {
        await course.populate('professor', '_id name')
        await course.populate('students.student', '_id name address email')

        if (!course) throw new Error();

        res.send({ status: 200, data: { course } });
    } catch (err) {
        res.status(500).send({ status: 500, message: "Internal server error." });
    }
};

const getAllCourses = async (req, res) => {
    const courses = await Course.find({}).populate('professor', '_id name').populate('classes.students.student', '_id name');

    try {
        res.send({ status: 200, data: { courses } });
    } catch (err) {
        res.status(500).send({ status: 500, message: err.message });
    }
};

const editCourse = async (req, res) => {
    const edits = Object.keys(req.body);
    // console.log(edits);
    const allowedEdits = ['name', 'professor', 'startingDate', 'endingDate', 'classes', 'date'];
    const areEditsValid = edits.every((edit) => allowedEdits.includes(edit));

    if (!areEditsValid) return res.status(400).send({ status: 400, message: 'Edits are not valid.' });

    const courseID = req.query.id;
    const course = await Course.findById(courseID);

    try {
        if (!course) return res.status(500).send({ status: 500, message: 'Internal server error.' });

        edits.forEach((edit) => (course[edit] = req.body[edit]));

        await course.save();

        res.send({ status: 200, message: 'Account information updated.', data: { course } });
    } catch (err) {
        // console.log(err.message);
        res.status(501).send({ status: 501, message: err });
    }
};

const deleteCourse = async (req, res) => {
    const courseID = req.query.id;
    const course = await Course.findById(courseID);

    try {
        if (!course) throw new Error();

        await course.remove();

        console.log("Course has been deleted successfully!");

        res.send({ status: 200, message: "Course has been deleted successfully!" });
    } catch (err) {
        res.status(500).send({ status: 500, message: 'Internal server error.' });
    }
};

module.exports = { createCourse, getCourse, getAllCourses, editCourse, deleteCourse };
