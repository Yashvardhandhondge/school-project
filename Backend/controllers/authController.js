import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import bcrypt from "bcryptjs"
import Teacher from '../models/Teacher.js';
import Student from '../models/Student.js';
import {Role} from '../enum.js';
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};


export const login = async (req, res) => {
    const { email, password, role,  } = req.body;

    try {
      let user;
      switch(role){
        case Role.Teacher:{
            user = await Teacher.findOne({email})
            break;
        }
        case Role.Student:{
            user = await Student.findOne({email})
            break;
        }
        default: {
            user = await Admin.findOne({email})
            break
        }
      }

      if (!user) return res.status(404).json({ message: 'User not found' });

      if(role === Role.Admin && !user.approved) return res.status(401).json({ message: 'User not approved' });
       

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid Credentials' });

        const token = generateToken(user._id, role);
        res.status(200).json({ token, role, userId: user._id });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


export const signup = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 12)
        const newUser = await Admin.create({
            name,
            email,
            password: hashedPassword,
            role,
        }) 
        const savedUser = await newUser.save();
        const token = generateToken(savedUser._id, role);
        if(!newUser.approved) return res.status(401).json({ message: 'User not approved' });   
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id: savedUser._id, name: savedUser.name, email: savedUser.email, role },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};