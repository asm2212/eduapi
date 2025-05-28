import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { adminLoginSchema, adminSignupSchema } from '../validator/adminValidator';
import httpResponse from '../utils/httpResponse';
import z from 'zod';
import httpError from '../utils/httpError';
import { hashPassword } from '../utils/hashPassword';
import apiMessages from '../constants/apiMessages';
import comparePassword from '../utils/comparePassword';
import { generateTokens, verifyAccessToken } from '../utils/tokens/tokens';
import { UserPayload } from '../types/tokensType';
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

        const decodedToken = verifyAccessToken(accessToken);

        console.log(decodedToken);

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

export const adminLogout = (_: Request, res: Response, next: NextFunction): void => {
    try {
        res.status(501).json({ message: 'Admin logout not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};

// admin self routes (profile management)
export const getMe = (_: Request, res: Response, next: NextFunction): void => {
    try {
        res.status(501).json({ message: 'Get admin profile not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};

export const updateMe = (_: Request, res: Response, next: NextFunction): void => {
    try {
        res.status(501).json({ message: 'Update admin profile not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};

export const changePassword = (_: Request, res: Response, next: NextFunction): void => {
    try {
        res.status(501).json({ message: 'Change admin password not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};

// company management

// create a new company
export const createCompany = (_: Request, res: Response, next: NextFunction) => {
    try {
        res.status(501).json({ message: 'Create company not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};

// get all companies
export const getCompanies = (_: Request, res: Response, next: NextFunction) => {
    try {
        res.status(501).json({ message: 'Get companies not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};
// get a single company by ID
export const getCompanyById = (_: Request, res: Response, next: NextFunction) => {
    try {
        res.status(501).json({ message: 'Get company by ID not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};
// update a company
export const updateCompany = (_: Request, res: Response, next: NextFunction) => {
    try {
        res.status(501).json({ message: 'Update company not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
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
export const blockCompany = (_: Request, res: Response, next: NextFunction) => {
    try {
        res.status(501).json({ message: 'Block company not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};

// activate a company
export const activateCompany = (_: Request, res: Response, next: NextFunction) => {
    try {
        res.status(501).json({ message: 'Activate company not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};

// deactivate a company
export const deactivateCompany = (_: Request, res: Response, next: NextFunction) => {
    try {
        res.status(501).json({ message: 'Deactivate company not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};

// get employees of a specific company
export const getCompanyEmployees = (_: Request, res: Response, next: NextFunction) => {
    try {
        res.status(501).json({ message: 'Get company employees not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};

// get a specific employee of a specific company
export const getCompanyEmployeeById = (_: Request, res: Response, next: NextFunction) => {
    try {
        res.status(501).json({ message: 'Get company employee by ID not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};

// Employee management

// create a new employee
export const createEmployee = (_: Request, res: Response, next: NextFunction) => {
    try {
        res.status(501).json({ message: 'Create employee not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};
// get all employees
export const getEmployees = (_: Request, res: Response, next: NextFunction) => {
    try {
        res.status(501).json({ message: 'Get employees not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};
// get a single employee by ID
export const getEmployeeById = (_: Request, res: Response, next: NextFunction) => {
    try {
        res.status(501).json({ message: 'Get employee by ID not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};
// update an employee
export const updateEmployee = (_: Request, res: Response, next: NextFunction) => {
    try {
        res.status(501).json({ message: 'Update employee not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};
// delete an employee
export const deleteEmployee = (_: Request, res: Response, next: NextFunction) => {
    try {
        res.status(501).json({ message: 'Delete employee not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};
// block an employee
export const blockEmployee = (_: Request, res: Response, next: NextFunction) => {
    try {
        res.status(501).json({ message: 'Block employee not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};
// activate an employee
export const activateEmployee = (_: Request, res: Response, next: NextFunction) => {
    try {
        res.status(501).json({ message: 'Activate employee not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};
// deactivate an employee
export const deactivateEmployee = (_: Request, res: Response, next: NextFunction) => {
    try {
        res.status(501).json({ message: 'Deactivate employee not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};

// Individual management

// get all individuals
export const getIndividuals = (_: Request, res: Response, next: NextFunction) => {
    try {
        res.status(501).json({ message: 'Get individuals not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};
// get a single individual by ID
export const getIndividualById = (_: Request, res: Response, next: NextFunction) => {
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
export const deleteIndividual = (_: Request, res: Response, next: NextFunction) => {
    try {
        res.status(501).json({ message: 'Delete individual not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};
// block an individual
export const blockIndividual = (_: Request, res: Response, next: NextFunction) => {
    try {
        res.status(501).json({ message: 'Block individual not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};
// activate an individual
export const activateIndividual = (_: Request, res: Response, next: NextFunction) => {
    try {
        res.status(501).json({ message: 'Activate individual not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};
// deactivate an individual
export const deactivateIndividual = (_: Request, res: Response, next: NextFunction) => {
    try {
        res.status(501).json({ message: 'Deactivate individual not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};

