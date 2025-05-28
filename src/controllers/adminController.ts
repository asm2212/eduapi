import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { adminChangePasswordSchema, adminLoginSchema, adminSignupSchema, adminUpdateSchema } from '../validator/adminValidator';
import httpResponse from '../utils/httpResponse';
import z from 'zod';
import httpError from '../utils/httpError';
import { hashPassword } from '../utils/hashPassword';
import apiMessages from '../constants/apiMessages';
import comparePassword from '../utils/comparePassword';
import { generateTokens, verifyAccessToken } from '../utils/tokens/tokens';
import { UserPayload } from '../types/tokensType';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
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

export const adminLogout = (req: Request, res: Response, next: NextFunction): void => {
    try {
        res.status(501).json({ message: 'Admin logout not implemented yet' });
    } catch (error) {
        if (error instanceof z.ZodArray) {
            return httpResponse(req, res, 400, apiMessages.error.validationError, {
                errors: error.errors
            });
        }
        //
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

