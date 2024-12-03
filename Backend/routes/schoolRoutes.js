import express from 'express';
import { getAllSchools, getStudents, getTeachers,getCurrentSchool,updateSchool,deleteSchool } from '../controllers/schoolController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import {Role} from '../enum.js';
const router = express.Router();

router.get('/',getAllSchools);
router.get('/students',authenticate,authorizeRoles(Role.SchoolAdmin, Role.Teacher),getStudents);
router.get('/teachers',authenticate,authorizeRoles(Role.SchoolAdmin),getTeachers);
router.get('/school',authenticate,authorizeRoles(Role.SchoolAdmin),getCurrentSchool);
router.put('/updateSchool/:id',authenticate,authorizeRoles(Role.SchoolAdmin),updateSchool);
router.delete('/deleteSchool/:id',authenticate,authorizeRoles(Role.SchoolAdmin),deleteSchool);




export default router;