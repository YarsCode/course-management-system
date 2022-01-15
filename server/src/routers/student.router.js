const express = require("express");
const studentAuth = require("../middleware/student.auth");
const professorAuth = require("../middleware/professor.auth");

const {
    createStudent,
    getStudent,
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
router.post("/login", login);
router.post("/logout", studentAuth, logout);
router.post("/logout-all", studentAuth, logoutFromAllDevices);
router.patch("/attendance", studentAuth, changeAttendanceStatus);
router.route("/me").get(studentAuth, getStudent).delete(professorAuth, deleteStudent).patch(studentAuth, editStudent);

module.exports = router;
