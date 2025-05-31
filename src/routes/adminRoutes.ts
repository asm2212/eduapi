import { Router } from 'express';
import {
    adminLogin,
    adminLogout,
    adminSignup,
    changeCompanyPlan,
    changeCompanyStatus,
    changeEmployeeStatus,
    changeIndividualStatus,
    changePassword,
    createCompany,
    createEmployee,
    deleteCompany,
    deleteEmployee,
    deleteIndividual,
    getCompanies,
    getCompanyById,
    getCompanyEmployeeById,
    getCompanyEmployees,
    getEmployeeById,
    getEmployees,
    getIndividualById,
    getIndividuals,
    getMe,
    updateCompany,
    updateEmployee,
    updateIndividual,
    updateMe
} from '../controllers/adminController';
import { protect, protectAdmin } from '../middlewares/authMiddleware';

const adminRouter = Router();

adminRouter.post('/signup', adminSignup);
adminRouter.post('/login', adminLogin);
adminRouter.post('/logout', adminLogout);

// Apply admin authentication middleware to all routes *after* authentication routes
// adminRouter.use(isAdmin);
adminRouter.use(protect, protectAdmin);

// Admin Self Routes (Protected by isAdmin middleware)
adminRouter.get('/me', getMe);
adminRouter.patch('/me', updateMe);
adminRouter.patch('/me/change-password', changePassword);

// comapny management routes
adminRouter
    .route('/companies')
    .post(createCompany) // create a new company
    .get(getCompanies); // get all companies

adminRouter
    .route('/companies/:companyId')
    .get(getCompanyById) // get a single company by ID
    .patch(updateCompany) // update a company
    .delete(deleteCompany); // delete a company

adminRouter.patch('/companies/:companyId/change-plan', changeCompanyPlan);
adminRouter.patch('/companies/:companyId/change-status', changeCompanyStatus); // Block a company

adminRouter.get('/companies/:companyId/employees', getCompanyEmployees); // Get employees of a company
adminRouter.get('/companies/:companyId/employees/:employeeId', getCompanyEmployeeById); // Get a specific employee of a company

// Employee Management (Independent of Companies)

adminRouter
    .route('/employees')
    .post(createEmployee) // Create a new employee
    .get(getEmployees); // Get all employees

adminRouter
    .route('/employees/:employeeId')
    .get(getEmployeeById) // Get a specific employee
    .patch(updateEmployee) // Update an employee
    .delete(deleteEmployee); // Delete an employee

adminRouter.patch('/employees/:employeeId/change-status', changeEmployeeStatus); // Change status of employee

// Individual Management
adminRouter.route('/individuals').get(getIndividuals); // Get all individuals

adminRouter
    .route('/individuals/:individualId')
    .get(getIndividualById) // Get a specific individual
    .patch(updateIndividual) // Update an individual
    .delete(deleteIndividual); // Delete an individual

adminRouter.patch('/individuals/:individualId/change-status', changeIndividualStatus); // Block an individual

export default adminRouter;

