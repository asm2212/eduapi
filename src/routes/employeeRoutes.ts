import { Router } from 'express';
import { employeeChangePassword, employeeLogin, employeeLogout, employeeProfile, employeeUpdate } from '../controllers/employeeController';
import { protect, protectEmployee } from '../middlewares/authMiddleware';

const employeeRouter = Router();

// Authentication Route (No auth middleware here)
employeeRouter.post('/login', employeeLogin);

employeeRouter.get('/logout', employeeLogout);

// Protected Routes (Require employee authentication)
employeeRouter.use(protect, protectEmployee);

// Self Routes
employeeRouter.route('/me').get(employeeProfile).patch(employeeUpdate);
employeeRouter.patch('/change-password', employeeChangePassword);
employeeRouter.patch('/verify-account');
employeeRouter.patch('/verify/:token');
employeeRouter.patch('/forget-password');
employeeRouter.patch('/reset-password/:token');

export default employeeRouter;

