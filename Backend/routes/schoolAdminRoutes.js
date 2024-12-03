import { addSchool, addStudent, addTeacher } from "../controllers/schoolAdminController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import express from 'express';
import {Role} from '../enum.js';
import { createForm } from "../controllers/formController.js";

const router = express.Router();

router.get('/dashboard', authenticate, authorizeRoles(Role.SchoolAdmin), (req, res) => {
    res.json({ message:` Welcome School Admin: ${req.user.id} `});
});

router.post('/addSchool',authenticate,authorizeRoles(Role.SchoolAdmin),addSchool)

router.post('/addTeacher',authenticate,authorizeRoles(Role.SchoolAdmin),addTeacher)
router.post('/addStudent',authenticate,authorizeRoles(Role.SchoolAdmin),addStudent)

router.post('/createForm',authenticate,authorizeRoles(Role.SchoolAdmin),createForm)


export default router;