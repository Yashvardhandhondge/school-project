import School from "../models/School.js"
import Student from "../models/Student.js"
import bcrypt from "bcryptjs"
import {Role} from '../enum.js';
import Admin from "../models/Admin.js";
export const addStudent = async (req, res) => {
    const {
        name,
        password,
        email,
        standard,
        parentEmail,
        sendNotifications
    } = req.body

    const schoolAdmin = await Admin.findById(req.user.id).select('schoolId');

    try{
        const hashedPassword = await bcrypt.hash(password, 12)
        
        const student = await Student.create({
            name,
            password: hashedPassword,
            standard,
            email,
            role: Role.Student,
            parentEmail,
            sendNotifications,
            schoolId: schoolAdmin.schoolId
        })
        await School.findOneAndUpdate({
            _id: schoolAdmin.schoolId
        }, {
            $push:{
                students:student._id
            }
        })
        return res.status(200).json({
            message: "Student Added successfully"
        })
    }catch(error){
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

export const updateStudent = async (req, res) => {
    const studentId = req.params.id;
    const { name, email, standard, parentEmail, sendNotifications } = req.body; 

    try{
        const updatedStudent = await Student.findByIdAndUpdate(studentId, {
            $set: { name, email, standard, parentEmail, sendNotifications }
        }, { new: true });

        if(!updatedStudent){
            return res.status(404).json({ message: 'Student not found' });
        }

        return res.status(200).json({ message: 'Student updated successfully', student: updatedStudent });
    }catch(error){
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }

}

export const deleteStudent = async (req, res) => {
    const studentId = req.params.id;

    try{
        const deletedStudent = await Student.findByIdAndDelete(studentId);

        if(!deletedStudent){
            return res.status(404).json({ message: 'Student not found' });
        }

        await School.updateMany(
            { students: studentId },
            { $pull: { students: studentId } }
        );

        return res.status(200).json({ message: 'Student deleted successfully' });
    }catch(error){
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
}
