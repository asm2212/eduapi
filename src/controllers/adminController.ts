import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import {
    adminChangeCompanyPlan,
    adminChangePasswordSchema,
    adminChangeStatus,
    adminCreateCompany,
    adminLoginSchema,
    adminSignupSchema,
    adminUpdateSchema
} from '../validator/adminValidator';
import httpResponse from '../utils/httpResponse';
import z from 'zod';
import httpError from '../utils/httpError';
import { hashPassword } from '../utils/hashPassword';
import apiMessages from '../constants/apiMessages';
import comparePassword from '../utils/comparePassword';
import { generateTokens } from '../utils/tokens/tokens';
import { UserPayload } from '../types/tokensType';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { companyUpdateSchema } from '../validator/companyValidator';
import logger from '../utils/logger';
import generateShortId from '../utils/uIds';
const prisma = new PrismaClient();

// amdin authentication controllers
export const adminSignup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // validate and parse the request body
        const { fullName, email, phone, password } = await adminSignupSchema.parseAsync(req.body);

        // check if the admin already exists (this is a placeholder, implement your own logic)
        const existingAdmin = await prisma.admin.findUnique({
            where: { email }
        });
        if (existingAdmin) {
            return httpResponse(req, res, 400, apiMessages.auth.emailAlreadyInUse);
        }
        // hash the password
        const hashedPassword = await hashPassword(password);
        // create the new admin (this is a placeholder, implement your own logic)
        const newAdmin = await prisma.admin.create({
            data: {
                fullName,
                email,
                phone,
                password: hashedPassword
            }
        });

        // structure the response data
        const adminData = {
            id: newAdmin.id,
            fullName: newAdmin.fullName,
            email: newAdmin.email,
            phone: newAdmin.phone,
            createdAt: newAdmin.createdAt,
            updatedAt: newAdmin.updatedAt
        };

        // use httpresponse for consistents success response
        return httpResponse(req, res, 201, apiMessages.admin.adminCreated, adminData);
    } catch (error) {
        // handle validation errors
        if (error instanceof z.ZodError) {
            return httpResponse(req, res, 400, 'Validation error', { errors: error.errors });
        }
        // handle other errors using httpError
        return httpError(next, error, req, 500);
    }
};

export const adminLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = await adminLoginSchema.parseAsync(req.body);

        // check if admin exits
        const admin = await prisma.admin.findUnique({
            where: {
                email
            }
        });

        if (!admin) {
            return httpResponse(req, res, 404, apiMessages.admin.adminNotFound);
        }

        // check password
        const isPasswordCorrect = await comparePassword(password, admin.password);

        if (!isPasswordCorrect) {
            return httpResponse(req, res, 401, apiMessages.auth.wrongCredentials);
        }

        const payload: UserPayload = {
            id: admin.id,
            accountType: admin.accountType,
            role: admin.role
        };
        // return httpResponse(req, res, 200, apiMessages.success.loggedIn, adminData);
        const { refreshToken, accessToken } = generateTokens(payload);
        // set refersh token as HTTP-only cokkie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            path: '/',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        return httpResponse(req, res, 200, apiMessages.success.loggedIn, {
            admin: {
                id: admin.id,
                fullName: admin.fullName,
                email: admin.email,
                phone: admin.phone,
                address: admin.address,
                accountType: admin.accountType,
                role: admin.role,
                status: admin.status,
                isVerified: admin.isVerified,
                userAgent: admin.userAgent,
                createdAt: admin.createdAt,
                token: accessToken
            }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return httpResponse(req, res, 400, apiMessages.error.validationError, { errors: error.errors });
        }
        return httpError(next, error, req, 500);
    }
};

export const adminLogout = (req: Request, res: Response, next: NextFunction): void => {
    try {
        res.clearCookie('refreshToken', {
            httpOnly: true, // Important: must match cookie options from setting
            // secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict', // Important: must match cookie options from setting
            path: '/' // If your cookie had a path set, include it hereAdd commentMore actions
        });
        return httpResponse(req, res, 200, apiMessages.success.loggedOut, { data: [] });
    } catch (error) {
        // Handle other errors using httpErrorAdd commentMore actions

        return httpError(next, error, req, 500);
    }
};

// admin self routes (profile management)
export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: apiMessages.error.unauthorized });
        }

        const { id } = req.user as UserPayload;

        const user = await prisma.admin.findUnique({
            where: { id },
            select: {
                fullName: true,
                email: true,
                phone: true,
                address: true,
                accountType: true,
                role: true,
                status: true,
                isVerified: true,
                lastLogin: true,
                createdAt: true
            } // Explicitly select only the required field
        });

        return httpResponse(req, res, 200, apiMessages.success.fetched, user);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            // Handle known Prisma errors (e.g., not found)
            if (error.code === 'P2025') {
                // Handle specific 'not found' error code
                res.status(404).json({ message: apiMessages.admin.adminNotFound }); // Clear "not found" message
            } else {
                // Handle other Prisma errors (e.g., database connection issues)
                console.error('Prisma error:', error);
                return httpError(next, error, req, 500); // Use existing error handler
            }
        } else if (error instanceof z.ZodError) {
            // Handle validation errors with httpResponse
            return httpResponse(req, res, 400, apiMessages.error.validationError, { errors: error.errors });
        } else {
            // Handle unexpected errors using httpError
            return httpError(next, error, req, 500);
        }
    }
};

export const updateMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Ensure user object exists on request (check for authentication middleware)
        if (!req.user) {
            res.status(401).json({ message: apiMessages.error.unauthorized }); // Use clear unauthorized message
        }

        const { id } = req.user as UserPayload; // Destructure user ID for clarity

        const adminData = await adminUpdateSchema.parseAsync(req.body);
        const updatedAdmin = await prisma.admin.update({
            where: { id: id },
            data: adminData
        });

        return httpResponse(req, res, 200, apiMessages.success.updated, updatedAdmin);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
            res.status(404).json({ message: apiMessages.admin.adminNotFound }); // Handle not found
        } else if (error instanceof z.ZodError) {
            return httpResponse(req, res, 400, apiMessages.error.validationError, { errors: error.errors }); // Zod validation errors
        }
        return httpError(next, error, req, 500);
    }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Ensure user object exists on request (check for authentication middleware)
        if (!req.user) {
            res.status(401).json({ message: apiMessages.error.unauthorized }); // Use clear unauthorized message
        }

        const { id } = req.user as UserPayload; // Destructure user ID for clarity

        const { oldPassword, newPassword } = await adminChangePasswordSchema.parseAsync(req.body);
        const admin = await prisma.admin.findUnique({
            where: { id }
        });
        if (!admin) {
            return httpResponse(req, res, 404, apiMessages.admin.adminNotFound);
        }

        // check password
        const isPasswordCorrect = await comparePassword(oldPassword, admin.password);

        if (!isPasswordCorrect) {
            return httpResponse(req, res, 401, apiMessages.auth.wrongCredentials);
        }

        const hashedPassword = await hashPassword(newPassword);

        // Update password using updateMany (if applicable)
        await prisma.admin.updateMany({
            where: { id },
            data: { password: hashedPassword } // Update only the password field
        });
        return httpResponse(req, res, 200, apiMessages.success.passwordChanged);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
            res.status(404).json({ message: apiMessages.admin.adminNotFound }); // Handle not found
        } else if (error instanceof z.ZodError) {
            return httpResponse(req, res, 400, apiMessages.error.validationError, { errors: error.errors }); // Zod validation errors
        }
        return httpError(next, error, req, 500);
    }
};

// company management

// create a new company
export const createCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fullName, email, phone, password, industry, username, description, plan, maxEmployees } = await adminCreateCompany.parseAsync(
            req.body
        );

        // Check if comapny already existsAdd commentMore actions
        const company = await prisma.admin.findUnique({
            where: { email }
        });

        if (company) {
            return httpResponse(req, res, 400, apiMessages.auth.emailAlreadyInUse);
        }

        const hashedPassword = await hashPassword(password);
        const compId = generateShortId();

        const newCompany = await prisma.company.create({
            data: {
                fullName,
                email,
                phone,
                companyId: compId,
                password: hashedPassword,
                industry,
                username,
                description,
                plan,
                maxEmployees
            }
        });
        return httpResponse(req, res, 201, apiMessages.company.companyCreated, { data: newCompany });
    } catch (error) {
        // Handle validation errors
        if (error instanceof z.ZodError) {
            return httpResponse(req, res, 400, 'Validation Error', { errors: error.errors });
        }
        // Handle other errors using httpError
        return httpError(next, error, req, 500);
    }
};

// get all companies
export const getCompanies = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const companies = await prisma.company.findMany({
            select: {
                fullName: true,
                email: true,
                phone: true,
                username: true,
                companyId: true,
                plan: true,
                maxEmployees: true,
                accountType: true,
                role: true,
                status: true,
                isVerified: true
            }
        });
        // Check if companies exist before sending a response

        if (!companies.length) {
            return httpResponse(req, res, 200, apiMessages.admin.noCompaniesFound, { data: [] });
        }
        return httpResponse(req, res, 200, apiMessages.admin.companiesFound, companies);
    } catch (error) {
        return httpError(next, error, req);
    }
};
// get a single company by ID
export const getCompanyById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { companyId } = req.params;

        if (companyId) {
            httpResponse(req, res, 400, apiMessages.error.invalidInput);
        }

        const company = await prisma.company.findUnique({
            where: { id: companyId },

            select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                username: true,
                companyId: true,
                plan: true,
                maxEmployees: true,
                accountType: true,
                role: true,
                status: true,
                isVerified: true
            }
        });

        if (!company) {
            httpResponse(req, res, 404, apiMessages.admin.noCompanyFound);
        }
        return httpResponse(req, res, 200, apiMessages.admin.companyFound, company);
    } catch (error) {
        return httpError(next, error, req, 500);
    }
};
// update a company
export const updateCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { companyId } = req.params;
        if (!companyId) {
            httpResponse(req, res, 400, apiMessages.error.invalidInput);
        }
        const companyData = await companyUpdateSchema.parseAsync(req.body);

        const updatedCompany = await prisma.company.update({
            where: { id: companyId },
            data: companyData
        });

        return httpResponse(req, res, 200, apiMessages.success.updated, updatedCompany);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return httpResponse(req, res, 400, apiMessages.error.validationError, { errors: error.errors }); // Zod validation errors
        }
        return httpError(next, error, req, 500);
    }
};

// delete a company
export const deleteCompany = (_: Request, res: Response, next: NextFunction) => {
    try {
        res.status(501).json({ message: 'Delete company not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};

// block a company
export const changeCompanyStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { companyId } = req.params;
        if (!companyId) {
            return httpResponse(req, res, 400, apiMessages.error.invalidInput);
        }
        const { status } = await adminChangeStatus.parseAsync(req.body);
        await prisma.company.update({
            where: { id: companyId },
            data: { status: status }
        });
        return httpResponse(req, res, 200, apiMessages.auth.blocked);
    } catch (error) {
        return httpError(next, error, req, 500);
    }
};

// change a company plan
export const changeCompanyPlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { companyId } = req.params;
        if (!companyId) {
            return httpResponse(req, res, 400, apiMessages.error.invalidInput);
        }
        const { plan, maxEmployees } = await adminChangeCompanyPlan.parseAsync(req.body);
        await prisma.company.update({
            where: { id: companyId },
            data: {
                plan,
                maxEmployees
            }
        });
        return httpResponse(req, res, 200, apiMessages.company.companyPlanChange);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
            return httpResponse(req, res, 404, apiMessages.company.companyNotFound);
        } else if (error instanceof z.ZodError) {
            return httpResponse(req, res, 400, apiMessages.error.validationError, { errors: error.errors });
        }
        return httpError(next, error, req, 500);
    }
};

// get employees of a specific company
export const getCompanyEmployees = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { companyId } = req.params;
        if (!companyId) {
            return httpResponse(req, res, 400, apiMessages.error.invalidInput);
        }

        const employees = await prisma.employee.findMany({
            where: { companyId: companyId }
        });

        if (!employees) {
            return httpResponse(req, res, 404, apiMessages.employee.employeesNotFound);
        }
        return httpResponse(req, res, 200, apiMessages.employee.employeesFound, employees);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
            return httpResponse(req, res, 404, apiMessages.company.companyNotFound);
        }
        return httpError(next, error, req, 500);
    }
};

// get a specific employee of a specific company
export const getCompanyEmployeeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { companyId, employeeId } = req.params;
        if (!companyId && !employeeId) {
            return httpResponse(req, res, 400, apiMessages.error.invalidInput);
        }
        const employee = await prisma.employee.findUnique({
            where: {
                companyId,
                id: employeeId
            }
        });
        if (!employee) {
            return httpResponse(req, res, 404, apiMessages.employee.employeeNotFound);
        }
        return httpResponse(req, res, 200, apiMessages.employee.employeeFound, employee);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
            return httpResponse(req, res, 404, apiMessages.company.companyNotFound);
        }
        return httpError(next, error, req, 500);
    }
};

// Employee management

// create a new employee
export const createEmployee = async (_: Request, res: Response, next: NextFunction) => {
    try {
        res.status(501).json({ message: 'Create employee not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};
// get all employees
export const getEmployees = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const employees = await prisma.employee.findMany();
        // Check if employees array is empty, not if it's null/undefined
        if (employees.length === 0) {
            return httpResponse(req, res, 200, apiMessages.employee.employeesNotFound, { data: [] }); // Return empty array with 200 OKAdd commentMore actions
        }
        return httpResponse(req, res, 200, apiMessages.employee.employeesFound, { data: employees }); // Return data in object
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            logger.error('Prisma Error in getEmployees:', error);
        }
        return httpError(next, error, req, 500);
    }
};

// get a single employee by ID
export const getEmployeeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { employeeId } = req.params;
        if (!employeeId) {
            return httpResponse(req, res, 400, apiMessages.error.invalidInput);
        }
        const employee = await prisma.employee.findUnique({
            where: {
                id: employeeId
            }
        });

        if (!employee) {
            return httpResponse(req, res, 404, apiMessages.employee.employeeNotFound, { data: [] });
        }
        return httpResponse(req, res, 200, apiMessages.employee.employeeFound, { data: employee });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
            return httpResponse(req, res, 404, apiMessages.employee.employeeNotFound);
        }
        return httpError(next, error, req, 500);
    }
};

// update an employee
export const updateEmployee = async (_: Request, res: Response, next: NextFunction) => {
    try {
        res.status(501).json({ message: 'Update employee not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};
// delete an employee
export const deleteEmployee = async (_: Request, res: Response, next: NextFunction) => {
    try {
        res.status(501).json({ message: 'Delete employee not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};
// block an employee
export const blockEmployee = async (_: Request, res: Response, next: NextFunction) => {
    try {
        res.status(501).json({ message: 'Block employee not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};
// change status of employee
export const changeEmployeeStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { employeeId } = req.params;
        if (!employeeId) {
            return httpResponse(req, res, 400, apiMessages.error.invalidInput);
        }
        const { status } = await adminChangeStatus.parseAsync(req.body);
        const updatedEmployee = await prisma.employee.update({
            where: { id: employeeId },
            data: { status },
            select: { status: true } // Select the updated status
        });
        if (!updatedEmployee) {
            return httpResponse(req, res, 404, apiMessages.employee.employeeNotFound);
        }
        let responseMessage: string;

        if (updatedEmployee.status === 'BLOCKED') {
            responseMessage = apiMessages.employee.employeeBlock; // Assignment (=), not comparison (===)
        } else if (updatedEmployee.status === 'ACTIVE') {
            responseMessage = apiMessages.employee.employeeActive; // Assignment (=)
        } else if (updatedEmployee.status === 'INACTIVE') {
            responseMessage = apiMessages.employee.employeeInactive; // Assignment (=)
        } else {
            responseMessage = apiMessages.employee.employeeUpdated; // Default message
        }
        return httpResponse(req, res, 200, responseMessage);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
            return httpResponse(req, res, 404, apiMessages.employee.employeeNotFound);
        }
        return httpError(next, error, req, 500);
    }
};
// deactivate an employee
export const deactivateEmployee = async (_: Request, res: Response, next: NextFunction) => {
    try {
        res.status(501).json({ message: 'Deactivate employee not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};

// Individual management

// get all individuals
export const getIndividuals = async (_: Request, res: Response, next: NextFunction) => {
    try {
        res.status(501).json({ message: 'Get individuals not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};
// get a single individual by ID
export const getIndividualById = async (_: Request, res: Response, next: NextFunction) => {
    try {
        res.status(501).json({ message: 'Get individual by ID not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};

// update an individual
export const updateIndividual = (_: Request, res: Response, next: NextFunction) => {
    try {
        res.status(501).json({ message: 'Update individual not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};
// delete an individual
export const deleteIndividual = async (_: Request, res: Response, next: NextFunction) => {
    try {
        res.status(501).json({ message: 'Delete individual not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};
// block an individual
export const blockIndividual = async (_: Request, res: Response, next: NextFunction) => {
    try {
        res.status(501).json({ message: 'Block individual not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};
// activate an individual
export const activateIndividual = async (_: Request, res: Response, next: NextFunction) => {
    try {
        res.status(501).json({ message: 'Activate individual not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};

/** Change status of an individual. */
export const changeIndividualStatus = async (_: Request, res: Response, next: NextFunction) => {
    try {
        res.status(501).json({ message: 'Deactivate individual not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};

