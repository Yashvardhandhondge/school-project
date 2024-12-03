import mongoose from 'mongoose'

const PointsHistorySchema = new mongoose.Schema({
    formId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Form'
    },
    formName: {
        type: String,
        required: true
    },
    formSubmissionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FormSubmission'
    },
    submittedById: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    submittedByName: {
        type: String,
        required: true
    },
    submittedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    submittedForId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    submittedForName: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School'
    }
})

export default mongoose.models.PointsHistory || mongoose.model('PointsHistory', PointsHistorySchema)
