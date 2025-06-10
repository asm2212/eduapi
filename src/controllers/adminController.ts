import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import {
    adminChangeCompanyPlan,
    adminChangePasswordSchema,
    adminChangeStatus,
    adminCreateCompany,
    adminIndividualUpdateSchema,
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
import logger from '../utils/logger';
import generateShortId from '../utils/uIds';
import { employeeSignupSchema } from '../validator/employeeValidator';
import { companyEmployeeUpdateSchema, companyUpdateSchema } from '../validator/companyValidator';
import sendInvitationMail from '../services/emails/company/sendInvitation';
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
        const userData = {
            id: newAdmin.id,
            fullName: newAdmin.fullName,
            email: newAdmin.email,
            phone: newAdmin.phone,
            createdAt: newAdmin.createdAt,
            updatedAt: newAdmin.updatedAt
        };

        // use httpresponse for consistents success response
        return httpResponse(req, res, 201, apiMessages.admin.adminCreated, { user: userData });
    } catch (error) {
        // handle validation errors
        if (error instanceof z.ZodError) {
            return httpResponse(req, res, 400, 'Validation error', { errors: error.errors });
        }
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                // Unique constraint violation (e.g., email already exists)
                return httpResponse(req, res, 400, apiMessages.auth.emailAlreadyInUse);
            }
            logger.error(`Prisma error during admin signup: ${error.message}`, error);
            return httpError(next, error, req, 500);
        }
        logger.error(`Error during admin signup: ${error}`, error);
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

        const userData = {
            id: admin.id,
            fullName: admin.fullName,
            email: admin.email,
            phone: admin.phone,
            accountType: admin.accountType,
            role: admin.role,
            status: admin.status,
            isVerified: admin.isVerified,
            createdAt: admin.createdAt,
            token: accessToken
        };
        return httpResponse(req, res, 200, apiMessages.success.loggedIn, { user: userData });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return httpResponse(req, res, 400, apiMessages.error.validationError, { errors: error.errors });
        }
        if (error instanceof PrismaClientKnownRequestError) {
            logger.error(`Prisma error during admin login: ${error.message}`, error);
            return httpError(next, error, req, 500);
        }
        logger.error(`Error during admin login: ${error}`, error);
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
export const adminProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: apiMessages.error.unauthorized });
        }

        const { id } = req.user as UserPayload;

        const userData = await prisma.admin.findUnique({
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

        if (!userData) {
            return httpResponse(req, res, 404, apiMessages.admin.adminNotFound);
        }

        return httpResponse(req, res, 200, apiMessages.success.fetched, { user: userData });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return httpResponse(req, res, 404, apiMessages.admin.adminNotFound);
            }
            logger.error(`Prisma error during getMe: ${error.message}`, error);
            return httpError(next, error, req, 500);
        }
        logger.error(`Error during getMe: ${error}`, error);

        return httpError(next, error, req, 500);
    }
};

export const updateAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

        return httpResponse(req, res, 200, apiMessages.success.updated, { user: updatedAdmin });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return httpResponse(req, res, 404, apiMessages.admin.adminNotFound);
            }

            logger.error(`Prisma error during updateAdmin: ${error.message}`, error);
            return httpError(next, error, req, 500);
        }

        if (error instanceof z.ZodError) {
            return httpResponse(req, res, 400, apiMessages.error.validationError, { errors: error.errors });
        }
        logger.error(`Error during updateAdmin: ${error}`, error);
        return httpError(next, error, req, 500);
    }
};

export const adminChangePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return httpResponse(req, res, 404, apiMessages.admin.adminNotFound);
            }
            logger.error(`Prisma error during adminChangePassword: ${error.message}`, error);
            return httpError(next, error, req, 500);
        }
        if (error instanceof z.ZodError) {
            return httpResponse(req, res, 400, apiMessages.error.validationError, { errors: error.errors });
        }
        logger.error(`Error during adminChangePassword: ${error}`, error);
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

        try {
            await sendInvitationMail({ fullName, email, password });
        } catch (mailError) {
            logger.error(`Error sending invitation mail: ${mailError}`, mailError);
            return httpResponse(req, res, 201, apiMessages.company.companyCreated, {
                user: newCompany,
                message: 'Company created, but invitation email failed to send.'
            });
        }
        return httpResponse(req, res, 201, apiMessages.company.companyCreated, { user: newCompany });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return httpResponse(req, res, 400, apiMessages.error.validationError, { errors: error.errors });
        }
        if (error instanceof PrismaClientKnownRequestError) {
            logger.error(`Prisma error during createCompany: ${error.message}`, error);
            return httpError(next, error, req, 500);
        }
        logger.error(`Error during createCompany: ${error}`, error);
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
            return httpResponse(req, res, 404, apiMessages.admin.noCompaniesFound, { users: [] });
        }
        return httpResponse(req, res, 200, apiMessages.admin.companiesFound, { users: companies });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            logger.error(`Prisma error during getCompanies: ${error.message}`, error);
            return httpError(next, error, req, 500);
        }

        logger.error(`Error during getCompanies: ${error}`, error);
        return httpError(next, error, req, 500);
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
        return httpResponse(req, res, 200, apiMessages.admin.companyFound, { user: company });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            logger.error(`Prisma error during getCompanyById: ${error.message}`, error);
            return httpError(next, error, req, 500);
        }

        logger.error(`Error during getCompanyById: ${error}`, error);
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

        return httpResponse(req, res, 200, apiMessages.success.updated, { user: updatedCompany });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return httpResponse(req, res, 400, apiMessages.error.validationError, { errors: error.errors });
        }
        if (error instanceof PrismaClientKnownRequestError) {
            logger.error(`Prisma error during updateCompany: ${error.message}`, error);
            return httpError(next, error, req, 500);
        }

        logger.error(`Error during updateCompany: ${error}`, error);
        return httpError(next, error, req, 500);
    }
};

// delete a company
export const deleteCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract company ID from request parameters
        const { companyId } = req.params;
        // Validate company ID presence
        if (!companyId) {
            return httpResponse(req, res, 400, apiMessages.error.invalidInput); // Handle missing ID
        }
        // Delete the company using Prisma
        await prisma.company.delete({ where: { id: companyId } });
        // Send success response
        return httpResponse(req, res, 200, apiMessages.company.companyDeleted);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            logger.error(`Prisma error during deleteCompany: ${error.message}`, error);
            return httpError(next, error, req, 500);
        }

        logger.error(`Error during deleteCompany: ${error}`, error);
        return httpError(next, error, req, 500);
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
        const updatedCompany = await prisma.company.update({
            where: { id: companyId },
            data: { status: status }
        });
        if (!updatedCompany) {
            return httpResponse(req, res, 404, apiMessages.company.companyNotFound);
        }

        let responseMessage: string;

        if (updatedCompany.status === 'BLOCKED') {
            responseMessage = apiMessages.company.companyBlock; // Assignment (=), not comparison (===)
        } else if (updatedCompany.status === 'ACTIVE') {
            responseMessage = apiMessages.company.companyActive; // Assignment (=)
        } else if (updatedCompany.status === 'INACTIVE') {
            responseMessage = apiMessages.company.companyInactive; // Assignment (=)
        } else {
            responseMessage = apiMessages.company.companyUpdated; // Default message
        }
        return httpResponse(req, res, 200, responseMessage);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return httpResponse(req, res, 400, apiMessages.error.validationError, { errors: error.errors });
        }

        if (error instanceof PrismaClientKnownRequestError) {
            logger.error(`Prisma error during changeCompanyStatus: ${error.message}`, error);
            return httpError(next, error, req, 500);
        }

        logger.error(`Error during changeCompanyStatus: ${error}`, error);
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
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return httpResponse(req, res, 404, apiMessages.company.companyNotFound);
            }
            logger.error(`Prisma error during changeCompanyPlan: ${error.message}`, error);
            return httpError(next, error, req, 500);
        }

        if (error instanceof z.ZodError) {
            return httpResponse(req, res, 400, apiMessages.error.validationError, { errors: error.errors });
        }

        logger.error(`Error during changeCompanyPlan: ${error}`, error);
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
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return httpResponse(req, res, 404, apiMessages.company.companyNotFound);
            }

            logger.error(`Prisma error during getCompanyEmployees: ${error.message}`, error);
            return httpError(next, error, req, 500);
        }

        logger.error(`Error during getCompanyEmployees: ${error}`, error);
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
        return httpResponse(req, res, 200, apiMessages.employee.employeeFound, { user: employee });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return httpResponse(req, res, 404, apiMessages.company.companyNotFound);
            }
            logger.error(`Prisma error during getCompanyEmployeeById: ${error.message}`, error);
            return httpError(next, error, req, 500);
        }

        logger.error(`Error during getCompanyEmployeeById: ${error}`, error);
        return httpError(next, error, req, 500);
    }
};

// Employee management

// create a new employee
export const createEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { companyId } = req.params;
        const employeeData = await employeeSignupSchema.parseAsync(req.body);
        // Check if the company exists
        const company = await prisma.company.findUnique({ where: { id: companyId } });
        if (!company) {
            return httpResponse(req, res, 404, apiMessages.company.companyNotFound);
        }
        // Hash the passwordAdd commentMore actions
        const hashedPassword = await hashPassword(employeeData.password);
        // Create the employee
        const employee = await prisma.employee.create({
            data: {
                ...employeeData,
                password: hashedPassword,
                companyId: company.id
            }
        });
        return httpResponse(req, res, 202, apiMessages.employee.employeeCreated, {
            user: employee
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return httpResponse(req, res, 400, apiMessages.error.validationError, { errors: error.errors });
        }
        if (error instanceof PrismaClientKnownRequestError) {
            logger.error(`Prisma error during createEmployee: ${error.message}`, error);
            return httpError(next, error, req, 500);
        }

        logger.error(`Error during createEmployee: ${error}`, error);
        return httpError(next, error, req, 500);
    }
};
// get all employees
export const getEmployees = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const employees = await prisma.employee.findMany();
        // Check if employees array is empty, not if it's null/undefined
        if (employees.length === 0) {
            return httpResponse(req, res, 404, apiMessages.employee.employeesNotFound, { users: [] }); // Return empty array with 200 OKAdd commentMore actions
        }
        return httpResponse(req, res, 200, apiMessages.employee.employeesFound, { users: employees }); // Return data in object
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            logger.error(`Prisma error during getEmployees: ${error.message}`, error);
            return httpError(next, error, req, 500);
        }

        logger.error(`Error during getEmployees: ${error}`, error);
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
            return httpResponse(req, res, 404, apiMessages.employee.employeeNotFound, { user: [] });
        }
        return httpResponse(req, res, 200, apiMessages.employee.employeeFound, { user: employee });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return httpResponse(req, res, 404, apiMessages.employee.employeeNotFound);
            }

            logger.error(`Prisma error during getEmployeeById: ${error.message}`, error);
            return httpError(next, error, req, 500);
        }

        logger.error(`Error during getEmployeeById: ${error}`, error);
        return httpError(next, error, req, 500);
    }
};

// update an employee
export const updateEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { employeeId } = req.params;
        const employeeData = await companyEmployeeUpdateSchema.parseAsync(req.body);
        const employee = await prisma.employee.findUnique({
            where: {
                id: employeeId
            }
        });

        if (!employee) {
            return httpResponse(req, res, 404, apiMessages.employee.employeeNotFound, { user: [] });
        }
        const updatedEmployee = await prisma.employee.update({
            where: {
                id: employee.id
            },
            data: employeeData
        });
        return httpResponse(req, res, 200, apiMessages.success.updated, { user: updatedEmployee });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return httpResponse(req, res, 400, apiMessages.error.validationError, { errors: error.errors });
        }

        if (error instanceof PrismaClientKnownRequestError) {
            logger.error(`Prisma error during updateEmployee: ${error.message}`, error);
            return httpError(next, error, req, 500);
        }

        logger.error(`Error during updateEmployee: ${error}`, error);
        return httpError(next, error, req, 500);
    }
};

// delete an employee
export const deleteEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { employeeId } = req.params;
        if (!employeeId) {
            return httpResponse(req, res, 400, apiMessages.error.invalidInput);
        }
        await prisma.employee.delete({
            where: { id: employeeId }
        });
        return httpResponse(req, res, 200, apiMessages.employee.employeeDeleted);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            logger.error(`Prisma error during deleteEmployee: ${error.message}`, error);
            return httpError(next, error, req, 500);
        }

        logger.error(`Error during deleteEmployee: ${error}`, error);
        return httpError(next, error, req, 500);
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
        return httpResponse(req, res, 200, responseMessage, { user: updatedEmployee });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return httpResponse(req, res, 400, apiMessages.error.validationError, { errors: error.errors });
        }
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return httpResponse(req, res, 404, apiMessages.employee.employeeNotFound);
            }
            logger.error(`Prisma error during changeEmployeeStatus: ${error.message}`, error);
            return httpError(next, error, req, 500);
        }

        logger.error(`Error during changeEmployeeStatus: ${error}`, error);
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
export const getIndividuals = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const individuals = await prisma.individual.findMany();
        // Check if companies exist before sending a response
        if (individuals.length === 0) {
            return httpResponse(req, res, 200, apiMessages.user.usersNotFound, { users: [] });
        }
        return httpResponse(req, res, 200, apiMessages.user.usersFound, { users: individuals });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            logger.error(`Prisma error during getIndividuals: ${error.message}`, error);
            return httpError(next, error, req, 500);
        }

        logger.error(`Error during getIndividuals: ${error}`, error);
        return httpError(next, error, req, 500);
    }
};
// get a single individual by ID
export const getIndividualById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { individualId } = req.params;
        const individual = await prisma.individual.findUnique({
            where: { id: individualId }
        });
        if (!individual) {
            return httpResponse(req, res, 404, apiMessages.user.userNotFound, { user: [] });
        }
        return httpResponse(req, res, 200, apiMessages.user.userFound, { user: individual });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            logger.error(`Prisma error during getIndividualById: ${error.message}`, error);
            return httpError(next, error, req, 500);
        }

        logger.error(`Error during getIndividualById: ${error}`, error);
        return httpError(next, error, req, 500);
    }
};

// update an individual
export const updateIndividual = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { individualId } = req.params;
        const individual = await prisma.individual.findUnique({
            where: { id: individualId }
        });
        if (!individual) {
            return httpResponse(req, res, 404, apiMessages.user.userNotFound);
        }

        const individualData = await adminIndividualUpdateSchema.parseAsync(req.body);

        const updatedIndividual = await prisma.individual.update({
            where: { id: individual.id },
            data: individualData
        });
        return httpResponse(req, res, 200, apiMessages.success.updated, { user: updatedIndividual });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return httpResponse(req, res, 400, apiMessages.error.validationError, { errors: error.errors });
        }
        if (error instanceof PrismaClientKnownRequestError) {
            logger.error(`Prisma error during updateIndividual: ${error.message}`, error);
            return httpError(next, error, req, 500);
        }

        logger.error(`Error during updateIndividual: ${error}`, error);
        return httpError(next, error, req, 500);
    }
};
// delete an individual
export const deleteIndividual = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { individualId } = req.params;
        if (!individualId) {
            return httpResponse(req, res, 400, apiMessages.error.invalidInput);
        }
        await prisma.individual.delete({
            where: { id: individualId }
        });
        return httpResponse(req, res, 200, apiMessages.user.userDeleted);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            logger.error(`Prisma error during deleteIndividual: ${error.message}`, error);
            return httpError(next, error, req, 500);
        }

        logger.error(`Error during deleteIndividual: ${error}`, error);
        return httpError(next, error, req, 500);
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
export const changeIndividualStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { individualId } = req.params;
        const individual = await prisma.individual.findUnique({
            where: { id: individualId }
        });
        if (!individual) {
            return httpResponse(req, res, 404, apiMessages.user.userNotFound);
        }
        const { status } = await adminChangeStatus.parseAsync(req.body);
        const updatedIndividual = await prisma.individual.update({
            where: { id: individual.id },
            data: { status },
            select: { status: true } // Select the updated status
        });
        let responseMessage: string;
        if (updatedIndividual.status === 'BLOCKED') {
            responseMessage = apiMessages.auth.blocked; // Assignment (=), not comparison (===)
        } else if (updatedIndividual.status === 'ACTIVE') {
            responseMessage = apiMessages.auth.active; // Assignment (=)
        } else if (updatedIndividual.status === 'INACTIVE') {
            responseMessage = apiMessages.auth.deactivate; // Assignment (=)
        } else {
            responseMessage = apiMessages.employee.employeeUpdated; // Default message
        }
        return httpResponse(req, res, 200, responseMessage, { user: updatedIndividual });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return httpResponse(req, res, 400, apiMessages.error.validationError, { errors: error.errors });
        }

        if (error instanceof PrismaClientKnownRequestError) {
            logger.error(`Prisma error during changeIndividualStatus: ${error.message}`, error);
            return httpError(next, error, req, 500);
        }

        logger.error(`Error during changeIndividualStatus: ${error}`, error);
        return httpError(next, error, req, 500);
    }
};

