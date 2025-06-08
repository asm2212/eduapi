import { Router } from 'express';
import {
    employeeChangePassword,
    employeeLogin,
    employeeLogout,
    employeeProfile,
    employeeUpdate,
    resetEmployeePassword,
    sendEmployeeResetPasswordMail
} from '../controllers/employeeController';
import { protect, protectEmployee } from '../middlewares/authMiddleware';

const employeeRouter = Router();

// Authentication Route (No auth middleware here)
employeeRouter.post('/login', employeeLogin);
employeeRouter.get('/logout', employeeLogout);
employeeRouter.patch('/verify-account');
employeeRouter.patch('/verify/:token');
employeeRouter.patch('/forget-password', sendEmployeeResetPasswordMail);
employeeRouter.patch('/reset-password/:token', resetEmployeePassword);

// Protected Routes (Require employee authentication)
employeeRouter.use(protect, protectEmployee);

// Self Routes
employeeRouter.route('/me').get(employeeProfile).patch(employeeUpdate);
employeeRouter.patch('/change-password', employeeChangePassword);

export default employeeRouter;

