const jwt = require('jsonwebtoken');
const Professor = require('../models/professor.model');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) throw new Error();

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);

        const professor = await Professor.findOne({ _id: decoded._id, 'tokens.token': token });
        // console.log(professor);

        if (!professor) throw new Error();

        req.professor = professor;
        req.token = token;

        next();
    } catch (err) {
        res.status(400).send({ status: 400, message: 'Please authenticate.' });
    }
};

module.exports = auth;