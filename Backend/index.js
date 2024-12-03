import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import AdminJs from 'adminjs';
import AdminJSExpress from '@adminjs/express';

import * as AdminJSMongoose from '@adminjs/mongoose'

import bcrypt from 'bcryptjs';
import session from 'express-session'; 

import User from './models/Admin.js';
import School from './models/School.js';
import Teacher from './models/Teacher.js';
import Student from './models/Student.js';

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import schoolAdminRoutes from './routes/schoolAdminRoutes.js';
import schoolRoutes from './routes/schoolRoutes.js';
import formRoutes from './routes/formRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import { authenticate } from './middlewares/authMiddleware.js';
import { getCurrentUser } from './controllers/generalController.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: false, 
    cookie: { secure: false }, 
  })
);



connectDB().then(() => {
  console.log("MongoDB connected");

  
  AdminJs.registerAdapter(AdminJSMongoose);


  const adminJs = new AdminJs({
    resources: [
      { resource: User, options: { properties: { password: { isVisible: false } } } },
      { resource: School },
      { resource: Teacher },
      { resource: Student },
      
    ],
    resave: false, 
    saveUninitialized: false, 
    secret: process.env.SESSION_SECRET,
    rootPath: '/admin',
  });


  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    adminJs,
    {
      authenticate: async (email, password) => {
        const user = await User.findOne({ email, role: 'Admin' });
        if (user && (await bcrypt.compare(password, user.password))) {
          return { id: user._id, email: user.email, role: user.role };
        }
        return null;
      },
      cookiePassword: process.env.JWT_SECRET,
    }
  );

  
  app.use(adminJs.options.rootPath, adminRouter);
}).catch((error) => {
  console.error('Error connecting to database', error);
});

app.use(
  session({
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: false, 
    cookie: { secure: false }, 
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/schoolAdmin', schoolAdminRoutes);
app.use('/api/school', schoolRoutes);
app.use('/api/student', studentRoutes);
app.get("/api/user", authenticate, getCurrentUser);
app.use('/api/form', formRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API is running...' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Server Error', error: err.message });
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));