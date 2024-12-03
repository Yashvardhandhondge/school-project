import { authenticate } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import express from 'express';
import {Role} from '../enum.js';
import { getFormById, getForms, getPointHistory, submitFormTeacher } from "../controllers/formController.js";

const router = express.Router();

router.get('/getForms',authenticate,authorizeRoles(Role.SchoolAdmin,Role.Teacher, Role.Student),getForms)
router.get('/getFormById/:id',authenticate,authorizeRoles(Role.SchoolAdmin,Role.Teacher, Role.Student),getFormById)
router.post('/submitFormTeacher/:formId',authenticate,authorizeRoles(Role.Teacher),submitFormTeacher)
router.get('/getPointHistory',authenticate,authorizeRoles(Role.SchoolAdmin,Role.Teacher),getPointHistory)

export default router;