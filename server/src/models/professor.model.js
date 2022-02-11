const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Course = require("./course.model");

const professorSchema = new mongoose.Schema(
    {
        name: {
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
professorSchema.pre("save", async function (next) {
    const professor = this;

    if (professor.isModified("password")) professor.password = await bcrypt.hash(professor.password, 8);

    next();
});

professorSchema.pre("remove", async function (next) {
    const professor = this;

    const coursesWithThisProfessor = await Course.find({ professor: professor.id });

    coursesWithThisProfessor.forEach(async (course) => await course.remove());

    next();
});

professorSchema.statics.findUserByEmailAndPassowrd = async (email, password) => {
    const professor = await Professor.findOne({ email: email });

    if (!professor) throw new Error("Unable to login.");

    const isPasswordMatch = await bcrypt.compare(password, professor.password);
    if (!isPasswordMatch) throw new Error("Unable to login.");

    return professor;
};

// Generates a token for the created student
professorSchema.methods.generateAuthToken = async function () {
    const professor = this;

    const token = jwt.sign({ _id: professor._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    professor.tokens = professor.tokens.concat({ token });
    await professor.save();

    return token;
};

professorSchema.methods.toJSON = function () {
    const professor = this;

    const professorObj = professor.toObject();
    delete professorObj.password;
    delete professorObj.tokens;

    return professorObj;
};

professorSchema.virtual("course", {
    ref: "Course",
    localField: "_id",
    foreignField: "professor",
});

const Professor = mongoose.model("Professor", professorSchema);

module.exports = Professor;
