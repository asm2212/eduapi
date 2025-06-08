import { Router } from 'express';
import {
    changeEmployeeStatus,
    changePassword,
    companyLogin,
    companyLogout,
    companySignup,
    createEmployee,
    deleteEmployee,
    getCompanyProfile,
    getEmployeeById,
    getEmployees,
    resetCompanyPassword,
    sendCompanyResetPasswordMail,
    sendCompanyVerificationMail,
    updateCompanyProfile,
    updateEmployee,
    verifyCompanyAccount
} from '../controllers/companyController';
import { protect, protectCompany } from '../middlewares/authMiddleware';

const companyRouter = Router();

// Company Authentication Routes (No auth middleware needed here)

companyRouter.post('/signup', companySignup);
companyRouter.post('/login', companyLogin);
companyRouter.post('/logout', companyLogout); // Protect logout
companyRouter.patch('/verify-account', sendCompanyVerificationMail);
companyRouter.patch('/verify/:token', verifyCompanyAccount);
companyRouter.patch('/forget-password', sendCompanyResetPasswordMail);
companyRouter.patch('/reset-password/:token', resetCompanyPassword);

// companyRouter.use(isCompanyAdmin);
companyRouter.use(protect, protectCompany);

// Company Admin Self Routes

companyRouter.get('/me', getCompanyProfile);

companyRouter.patch('/me', updateCompanyProfile);

companyRouter.patch('/me/change-password', changePassword);

// Company Employee Management

companyRouter

    .route('/employees')

    .post(createEmployee) // Create a new employee within the company

    .get(getEmployees); // Get all employees of the company (with optional filters/pagination)

companyRouter

    .route('/employees/:employeeId')

    .get(getEmployeeById) // Get a specific employee of the company

    .patch(updateEmployee) // Update an employee of the company

    .delete(deleteEmployee); // Delete an employee of the company

companyRouter.patch('/employees/:employeeId/change-status', changeEmployeeStatus); // Change Employee Status

export default companyRouter;

