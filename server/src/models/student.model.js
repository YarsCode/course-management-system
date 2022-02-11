const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Course = require("./course.model");

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        dateOfBirth: {
            type: Date,
            required: true,
            validate(value) {
                const today = new Date();

                let age = today.getFullYear() - value.getFullYear();
                const m = today.getMonth() - value.getMonth();

                if (m < 0 || (m === 0 && today.getDate() < value.getDate())) age--;

                if (age < 18) throw new Error("You must be at least 18 years old.");
            },
        },
        address: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            trim: true,
            unique: true,
            required: true,
            validate(value) {
                if (!validator.isEmail(value)) throw new Error("Invalid email.");
            },
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            validate(value) {
                const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

                if (!passRegex.test(value)) {
                    throw new Error(
                        "Password must contain at least 8 characters, 1 number, 1 uppercase and 1 lowercase letter."
                    );
                }
            },
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Hashes the password before saving it into the DB
studentSchema.pre("save", async function (next) {
    const student = this;

    if (student.isModified("password")) student.password = await bcrypt.hash(student.password, 8);

    next();
});

// If a students gets deleted - this middleware deletes him from all the courses he was enrolled in
studentSchema.pre("remove", async function (next) {
    const student = this;
    const coursesWithThisStudent = await Course.find({"classes.students.student": student.id});
    // console.log(coursesWithThisStudent);

    coursesWithThisStudent.forEach(async course => {
        // course.students = course.students.filter(studentToDelete => studentToDelete.toString() !== student.id)
        course.classes.forEach(thisClass => {
            // const classesWithThisStudent = course.classes.filter(thisClass => thisClass.students.student.toString() === student.id);            
            thisClass.students = thisClass.students.filter(studentToDelete => studentToDelete.student.toString() !== student.id)
        });

        await course.save()
    });

    next();
});

studentSchema.statics.findUserByEmailAndPassowrd = async (email, password) => {
    const student = await Student.findOne({ email: email });

    if (!student) throw new Error('Unable to login.');

    const isPasswordMatch = await bcrypt.compare(password, student.password);
    if (!isPasswordMatch) throw new Error('Unable to login.');

    return student;
};

// Generates a token for the created student
studentSchema.methods.generateAuthToken = async function () {
    const student = this;

    const token = jwt.sign({ _id: student._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    student.tokens = student.tokens.concat({ token });
    await student.save();

    return token;
};

studentSchema.methods.toJSON = function () {
    const student = this;

    const studentObj = student.toObject();
    delete studentObj.password;
    delete studentObj.tokens;

    return studentObj;
};

studentSchema.virtual('course', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'students.student',
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
