import { Role } from "../enum.js"
import Admin from "../models/Admin.js"
import Form from "../models/Form.js"
import FormSubmissions from "../models/FormSubmissions.js"
import School from "../models/School.js"
import Teacher from "../models/Teacher.js"

export const createForm = async (req, res) => {
    const {
        formName,
        formType,
        questions
    } = req.body
    const id = req.user.id
    const school = await School.findOne({createdBy:id})
    try{
        const form = await Form.create({
            schoolId: school._id,
            formName,
            formType,
            questions
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
        answers
    } = req.body
    const teacherId = req.user.id
    try{
        const formSubmission = await FormSubmissions.create({
            formId,
            teacherId,
            answers
        })
        return res.status(200).json({
            message: "Form Submitted Successfully",
            formSubmission: formSubmission
        })
    }catch(error){
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
}
