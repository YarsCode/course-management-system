const jwt = require('jsonwebtoken');
const Student = require('../models/student.model');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) throw new Error();

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);

        const student = await Student.findOne({ _id: decoded._id, 'tokens.token': token });
        // console.log(student);

        if (!student) throw new Error();

        req.student = student;
        req.token = token;

        next();
    } catch (err) {
        res.status(400).send({ status: 400, message: 'Please authenticate.' });
    }
};

module.exports = auth;