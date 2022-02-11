const express = require("express");
const professorAuth = require("../middleware/professor.auth");

const {
    createProfessor,
    getProfessor,
    getAllProfessors,
    login,
    logout,
    logoutFromAllDevices,
    editProfessor,
    deleteProfessor,
} = require("../controllers/professor.controller");

const router = express.Router();

// Routers
router.post("/new", createProfessor);
router.post("/login", login);
router.get("/all", professorAuth, getAllProfessors);
router.post("/logout", professorAuth, logout);
router.post("/logout-all", professorAuth, logoutFromAllDevices);
router
    .route("/me")
    .get(professorAuth, getProfessor)
    .delete(professorAuth, deleteProfessor)
    .patch(professorAuth, editProfessor);

module.exports = router;
