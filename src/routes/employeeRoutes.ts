import { Router } from 'express';
import { employeeLogin, getMe, updateMe } from '../controllers/employeeController';

const employeeRouter = Router();

// Authentication Route (No auth middleware here)
employeeRouter.post('/login', employeeLogin);

// Protected Routes (Require employee authentication)
// employeeRouter.use(isEmployee);

// Self Routes
employeeRouter.get('/me', getMe);
employeeRouter.patch('/me', updateMe);

export default employeeRouter;
