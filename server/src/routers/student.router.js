const express = require("express");
const studentAuth = require("../middleware/student.auth");
const professorAuth = require("../middleware/professor.auth");

const {
    createStudent,
    getStudent,
    getAllStudents,
    getAllExistingEmails,
    getAllClassesWithStudent,
    login,
    logout,
    logoutFromAllDevices,
    editStudent,
    changeAttendanceStatus,
    deleteStudent,
} = require("../controllers/student.controller");

const router = express.Router();

// Routers
router.post("/new", professorAuth, createStudent);
router.get("/all", professorAuth, getAllStudents);
router.get("/all-emails", studentAuth, getAllExistingEmails);
router.get("/me/all-classes", studentAuth, getAllClassesWithStudent);
router.post("/login", login);
router.post("/logout", studentAuth, logout);
router.post("/logout-all", studentAuth, logoutFromAllDevices);
router.patch("/attendance", studentAuth, changeAttendanceStatus);
router.route("/me").get(studentAuth, getStudent).delete(professorAuth, deleteStudent).patch(studentAuth, editStudent);

module.exports = router;
