import mongoose from 'mongoose';
import {Role} from '../enum.js';

const studentSchema = new mongoose.Schema({
  email:{
    type:String,
    required:true,
    unique:true
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(Role),
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  standard:{
    type:String,
    default: null
  },
  points:{
    type: Number,
    default: 0
  },
  parentEmail:{
    type:String,
    default: null
  },
  sendNotifications:{
    type:Boolean,
    default: false
  },
  schoolId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School', 
    default: null,
  }
});

studentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});


export default mongoose.model('Student', studentSchema);