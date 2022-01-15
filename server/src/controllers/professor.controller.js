const Professor = require("../models/professor.model");

const createProfessor = async (req, res) => {
    const professor = new Professor(req.body);

    try {
        await professor.save();

        const token = await professor.generateAuthToken();

        console.log("A new professor's account has been created successfully!");

        res.status(201).send({ status: 201, data: { professor, token } });
    } catch (err) {
        console.log(err);
        res.status(400).send({ status: 400, message: err.message });
    }
};

const getProfessor = async (req, res) => {
    const professor = req.professor;
    // console.log(professor);

    try {
        if (!professor) throw new Error();

        res.send({ status: 200, data: { professor } });
    } catch (err) {
        res.status(500).send({ status: 500, message: "Internal server error." });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const professor = await Professor.findUserByEmailAndPassowrd(email, password);

        const token = await professor.generateAuthToken();

        res.send({ status: 200, data: { professor, token } });
    } catch (err) {
        res.status(401).send({ status: 401, message: err.message });
    }
};

const logout = async (req, res) => {
    const professor = req.professor;
    const token = req.token;

    try {
        if (!professor || !token) throw new Error();

        professor.tokens = professor.tokens.filter((thisToken) => thisToken.token !== token);
        await professor.save();

        res.send({ status: 200, message: 'Logout successful.' });
    } catch (err) {
        res.status(500).send({ status: 500, message: 'Internal server error.' });
    }
};

const logoutFromAllDevices = async (req, res) => {
    const professor = req.professor;

    try {
        if (!professor) throw new Error();

        professor.tokens = [];
        await professor.save();

        res.send({ status: 200, message: 'Logout from all devices successful.' });
    } catch (err) {
        res.status(500).send({ status: 500, message: 'Internal server error.' });
    }
};

const editProfessor = async (req, res) => {
    const edits = Object.keys(req.body);
    const allowedEdits = ['name', 'email', 'password'];
    const areEditsValid = edits.every((edit) => allowedEdits.includes(edit));

    if (!areEditsValid) return res.status(400).send({ status: 400, message: 'Edits are not valid.' });

    const professor = req.professor;

    try {
        if (!professor) return res.status(500).send({ status: 500, message: 'Internal server error.' });

        edits.forEach((edit) => (professor[edit] = req.body[edit]));

        await professor.save();

        res.send({ status: 200, message: 'Account information updated.', data: { professor } });
    } catch (err) {
        res.status(501).send({ status: 501, message: err });
    }
};

const deleteProfessor = async (req, res) => {
    const professor = req.professor;

    try {
        if (!professor) throw new Error();

        await professor.remove();

        console.log("Professor's account has been deleted successfully!");

        res.send({ status: 200, message: "Professor's account has been deleted successfully!" });
    } catch (err) {
        res.status(500).send({ status: 500, message: 'Internal server error.' });
    }
};

module.exports = { createProfessor, getProfessor, login, logout, logoutFromAllDevices, editProfessor, deleteProfessor };
