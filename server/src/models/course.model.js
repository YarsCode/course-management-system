const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        professor: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Professor",
            required: true,
        },
        // students: [
        //     {
        //         type: mongoose.SchemaTypes.ObjectId,
        //         ref: "Student",
        //         required: true,
        //     },
        // ],
        startingDate: {
            type: Date,
            required: true,
        },
        endingDate: {
            type: Date,
            required: true,
            validate(value) {
                if (value < this.startingDate) {
                    throw new Error("Ending date can't be before the starting date.");
                }
            },
        },
        classes: [
            {
                date: {
                    type: Date,
                    required: true,
                },
                students: [
                    {
                        _id: false,
                        student: {
                            type: mongoose.SchemaTypes.ObjectId,
                            ref: "Student",
                            required: true,
                        },
                        attendance: {
                            type: Boolean,
                            required: false,
                        },
                        reasonForAbsence: {
                            type: String,
                            required: function () {
                                return this.attendance !== null && !this.attendance;
                            },
                        },
                    },
                ],
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
