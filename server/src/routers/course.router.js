const express = require("express");
const professorAuth = require("../middleware/professor.auth");

const { createCourse, getCourse, getAllCourses, editCourse, deleteCourse } = require("../controllers/course.controller");

const router = express.Router();

// Routers
router.post("/new", professorAuth, createCourse);
router.get("/all", professorAuth, getAllCourses);
// router.post("/logout", professorAuth, logout);
// router.post("/logout-all", professorAuth, logoutFromAllDevices);
router.route("/course").get(professorAuth, getCourse).patch(professorAuth, editCourse).delete(professorAuth, deleteCourse);

module.exports = router;
