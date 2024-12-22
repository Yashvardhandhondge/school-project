import { Role } from "../enum.js"
import Admin from "../models/Admin.js"
import Form from "../models/Form.js"
import FormSubmissions from "../models/FormSubmissions.js"
import PointsHistory from "../models/PointsHistory.js"
import School from "../models/School.js"
import Teacher from "../models/Teacher.js"
import Student from "../models/Student.js"
import { sendEmail } from "../services/nodemailer.js"
export const createForm = async (req, res) => {
    const {
        formName,
        formType,
        questions,
        studentEmail = false,
        teacherEmail = false,
        schoolAdminEmail = false,
        parentEmail = false,
    } = req.body
    const id = req.user.id
    const school = await School.findOne({createdBy:id})
    try{
        const form = await Form.create({
            schoolId: school._id,
            formName,
            formType,
            questions,
            studentEmail,
            teacherEmail,
            schoolAdminEmail,
            parentEmail
        })
        return res.status(200).json({
            message: "Form Created Successfully",
            form: form
        })
    }catch(error){
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

export const getForms = async (req, res) => {
    const id = req.user.id
    let user;
    
    switch(req.user.role){
        case Role.SchoolAdmin:
            user = await Admin.findById(id)
            break;
        case Role.Teacher:
            user = await Teacher.findById(id)
            break;
        case Role.Student:
            user = await Student.findById(id)
            break;
        default:
            return res.status(403).json({ message: 'Forbidden' });
    }
    
    const schoolId = user.schoolId
    

    try{
        const forms = await Form.find({schoolId})
        return res.status(200).json({
            message: "Forms Fetched Successfully",
            forms: forms
        })
    }catch(error){
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }   
}

export const getFormById = async (req, res) => {
    const id = req.params.id
    try{
        const form = await Form.findById(id)
        return res.status(200).json({form})
    }catch(error){
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

export const submitFormTeacher = async (req, res) => {
    const formId = req.params.formId
    const {
        submittedFor,
        answers,
    } = req.body
    const teacherId = req.user.id
    const teacher = await Teacher.findById(teacherId)
    const form = await Form.findById(formId)
    const submittedForStudent = await Student.findById(submittedFor)
    const totalPoints = answers.reduce((acc, curr) => acc + curr.points, 0);


    try{
        const formSubmission = await FormSubmissions.create({
            formId,
            teacherId,
            answers
        })

        const info = `Form ${form.formName} submitted by ${teacher.name} for ${submittedForStudent.name} with ${totalPoints} points`

        let sentToTeacher, sentToStudent, sentToAdmin, sentToParent1, sentToParent2;

        if(form.teacherEmail && teacher.recieveMails)
             sentToTeacher = await sendEmail(teacher.email, 'Form Submitted', info, info)
        if(form.studentEmail)
             sentToStudent = await sendEmail(submittedForStudent.email, 'Form Submitted', info, info)
        if(form.schoolAdminEmail)
             sentToAdmin = await sendEmail(teacher.schoolAdmin.email, 'Form Submitted', info, info)
        if(form.parentEmail && submittedForStudent.parentEmail && submittedForStudent.sendNotifications)
             sentToParent1 = await sendEmail(submittedForStudent.parentEmail, 'Form Submitted', info, info)
        if(form.parentEmail && submittedForStudent.standard && submittedForStudent.sendNotifications)
             sentToParent2 = await sendEmail(submittedForStudent.standard, 'Form Submitted', info, info)

        const pointsHistory = await PointsHistory.create({
            formId: form._id,
            formName: form.formName,
            formSubmissionId: formSubmission._id,
            submittedById: teacherId,
            submittedByName: teacher.name,
            submittedForId: submittedFor,
            submittedForName: submittedForStudent.name,
            points: totalPoints,
            schoolId: teacher.schoolId
        })


        return res.status(200).json({
            message: "Form Submitted Successfully",
            formSubmission: formSubmission,
            email: {
                sentToTeacher,
                sentToStudent,
                sentToAdmin,
                sentToParent1,
                sentToParent2
            }
        })
    }catch(error){
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

export const getPointHistory = async (req, res) => {
    const id = req.user.id
    let user;   
    switch(req.user.role){
        case Role.SchoolAdmin:
            user = await Admin.findById(id)
            break;
        case Role.Teacher:
            user = await Teacher.findById(id)
            break;
        default:
            return res.status(403).json({ message: 'Forbidden' });
    }
    const pointHistory = await PointsHistory.find({schoolId: user.schoolId})
    return res.status(200).json({pointHistory})
}