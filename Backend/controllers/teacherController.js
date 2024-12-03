import Student from '../models/Student.js';
import School from "../models/School.js"
import bcrypt from "bcryptjs"
import Teacher from "../models/Teacher.js"
import {Role} from '../enum.js';
import Admin from '../models/Admin.js';
export const awardPoints = async (req, res) => {
    const { studentId, points } = req.body;
    const teacherId = req.user.id;

    try {
        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        student.points += points;
        await student.save();

        res.status(200).json({ message: 'Points awarded successfully', student });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export const addTeacher = async (req, res) => {
    const {
        name,
        password,
        email,
        subject,
        recieveMails
    } = req.body

    const schoolAdmin = await Admin.findById(req.user.id).select('schoolId');
   

    try{
        const hashedPassword = await bcrypt.hash(password, 12)
        
        const teacher = await Teacher.create({
            name,
            email,
            password: hashedPassword,
            subject,
            role: Role.Teacher,
            recieveMails: recieveMails || false,
            schoolId: schoolAdmin.schoolId
        })
        await School.findOneAndUpdate({
            _id: schoolAdmin.schoolId
        }, {
            $push:{
                teachers:teacher._id
            }
        })
        return res.status(200).json({
            message: "Teacher Added successfully"
        })
    }catch(error){
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

export const updateTeacher = async (req, res) => {
    const teacherId = req.params.id;
    const { name, email, subject, recieveMails } = req.body;

    try {
        const updatedTeacher = await Teacher.findByIdAndUpdate(
            teacherId,
            {
                $set: {
                    name,
                    email,
                    subject,
                    recieveMails
                }
            },
            { new: true } 
        );

        if (!updatedTeacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        return res.status(200).json({
            message: 'Teacher updated successfully',
            teacher: updatedTeacher
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export const deleteTeacher = async (req, res) => {
    const teacherId = req.params.id;

    try {
        const deletedTeacher = await Teacher.findByIdAndDelete(teacherId);

        if (!deletedTeacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        await School.updateMany(
            { teachers: teacherId },
            { $pull: { teachers: teacherId } }
        );

        return res.status(200).json({
            message: 'Teacher deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
