import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
    questionId: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    points: {
        type: Number,
        required: true,
    }
})

const formSubmissionSchema = new mongoose.Schema({
    formId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Form",
        required: true,
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: true,
    },
    answers: {
        type: [AnswerSchema],
        required: true,
    },
})



export default mongoose.model("FormSubmission", formSubmissionSchema);
