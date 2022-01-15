const express = require('express');
const cors = require('cors');

const studentRouter = require('./routers/student.router');
const professorRouter = require('./routers/professor.router');
const courseRouter = require('./routers/course.router');

require('./db/mongoose.db')

const app = express();

app.use(express.json());
app.use(cors());

app.use('/students', studentRouter);
app.use('/professors', professorRouter);
app.use('/courses', courseRouter);

module.exports = app;
