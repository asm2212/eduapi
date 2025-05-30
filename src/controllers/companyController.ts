import { Request, Response, NextFunction } from 'express';
import { companyChangePasswordSchema, companyLoginSchema, companySignupSchema } from '../validator/companyValidator';
import apiMessages from '../constants/apiMessages';
import generateShortId from '../utils/uIds';
import { hashPassword } from '../utils/hashPassword';
import httpResponse from '../utils/httpResponse';
import { PrismaClient } from '@prisma/client';
import httpError from '../utils/httpError';
import z from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UserPayload } from '../types/tokensType';
import { generateTokens } from '../utils/tokens/tokens';
import comparePassword from '../utils/comparePassword';
import { employeeSignupSchema } from '../validator/employeeValidator';
const prisma = new PrismaClient();

//company authentication controllers
export const companySignup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Validate and parse request body
        const { fullName, email, phone, password } = await companySignupSchema.parseAsync(req.body);

        // Check if company already exists
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
                password: hashedPassword
            }
        });
        const companyData = {
            id: newCompany.id,
            fullName: newCompany.fullName,
            email: newCompany.fullName,
            phone: newCompany.phone,
            companyId: newCompany.companyId,
            createdAt: newCompany.createdAt
        };
        return httpResponse(req, res, 201, apiMessages.company.companyCreated, companyData);
    } catch (error) {
        // Handle validation errors
        if (error instanceof z.ZodError) {
            return httpResponse(req, res, 400, 'Validation Error', { errors: error.errors });
        }
        // Handle other errors using httpError
        return httpError(next, error, req, 500);
    }
};

export const companyLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = await companyLoginSchema.parseAsync(req.body);

        const company = await prisma.company.findUnique({
            where: {
                email
            }
        });

        if (!company) {
            return httpResponse(req, res, 404, apiMessages.company.companyNotFound);
        }

        const isPasswordCorrect = await comparePassword(password, company.password);

        if (!isPasswordCorrect) {
            return httpResponse(req, res, 401, apiMessages.auth.wrongCredentials);
        }

        const payload: UserPayload = {
            id: company.id,
            role: company.role,
            accountType: company.accountType
        };

        const { refreshToken, accessToken } = generateTokens(payload);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            // secure: config.ENV === 'production',
            sameSite: 'strict', // recommended for security
            path: '/',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds (or from env)
        });

        return httpResponse(req, res, 200, apiMessages.success.loggedIn, {
            company: {
                id: company.id,
                fullName: company.fullName,
                email: company.email,
                phone: company.phone,
                address: company.address,
                accountType: company.accountType,
                industry: company.industry,
                social: company.socialLinks,
                logo: company.companyLogo,
                description: company.description,
                website: company.website,
                plan: company.plan,
                maxEmployees: company.maxEmployees,
                role: company.role,
                status: company.status,
                isVerified: company.isVerified,
                userAgent: company.userAgent,
                createdAt: company.createdAt,
                token: accessToken
            }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return httpResponse(req, res, 400, apiMessages.error.validationError, { errors: error.errors });
        }
        // Handle other errors using httpError

        return httpError(next, error, req, 500);
    }
};

export const companyLogout = (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie('refreshToken', {
            httpOnly: true, // Important: must match cookie options from setting
            // secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict', // Important: must match cookie options from setting
            path: '/' // If your cookie had a path set, include it hereAdd commentMore actions
        });
        return httpResponse(req, res, 200, apiMessages.success.loggedOut, { data: [] });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return httpResponse(req, res, 400, apiMessages.error.validationError, { errors: error.errors });
        }
        // Handle other errors using httpError
        return httpError(next, error, req, 500);
    }
};

// company admin self routes (profile management)
export const getCompanyProfile = (_: Request, res: Response, next: NextFunction): void => {
    try {
        res.status(501).json({ message: 'Get company profile not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};

export const updateCompanyProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: apiMessages.error.unauthorized }); // Use clear unauthorized message
        }

        const { id } = req.user as UserPayload;
        const user = await prisma.company.findUnique({
            where: { id },
            select: {
                fullName: true,
                email: true,
                phone: true,
                address: true,
                socialLinks: true,
                website: true,
                username: true,
                industry: true,
                description: true,
                companyLogo: true,
                companyId: true,
                plan: true,
                maxEmployees: true,
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
        if (error instanceof z.ZodError) {
            // Handle validation errors with httpResponse

            return httpResponse(req, res, 400, apiMessages.error.validationError, { errors: error.errors });
        } else {
            // Handle unexpected errors using httpError
            return httpError(next, error, req, 500);
        }
    }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: apiMessages.error.unauthorized }); // Use clear unauthorized message
        }

        const { id } = req.user as UserPayload;
        const { oldPassword, newPassword } = await companyChangePasswordSchema.parseAsync(req.body);

        const company = await prisma.company.findUnique({
            where: { id }
        });

        if (!company) {
            return httpResponse(req, res, 404, apiMessages.company.companyNotFound);
        }
        // check password

        const isPasswordCorrect = await comparePassword(oldPassword, company.password);

        if (!isPasswordCorrect) {
            return httpResponse(req, res, 401, apiMessages.auth.wrongCredentials);
        }

        const hashedPassword = await hashPassword(newPassword);
        // Update password using updateMany (if applicable)

        await prisma.company.updateMany({
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

// employee management

export const createEmployee = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: apiMessages.error.unauthorized }); // Use clear unauthorized message
        }
        const { id } = req.user as UserPayload;
        const { fullName, email, empId, phone, password, department, dateOfBirth, gender, jobTitle, status } = await employeeSignupSchema.parseAsync(
            req.body
        );
        const company = await prisma.company.findUnique({
            where: { id }
        });

        if (!company) {
            return httpResponse(req, res, 404, apiMessages.company.companyNotFound);
        }
        const employee = await prisma.employee.create({
            data: {
                fullName,
                email,
                empId,
                phone,
                password,
                department,
                dateOfBirth,
                gender,
                jobTitle,
                status,
                companyId: company.id
            }
        });
        return httpResponse(req, res, 201, apiMessages.employee.employeeCreated, employee);
    } catch (error) {
        // Handle validation errors
        if (error instanceof z.ZodError) {
            return httpResponse(req, res, 400, 'Validation Error', { errors: error.errors });
        }

        // Handle other errors using httpError
        return httpError(next, error, req, 500);
    }
};

export const getEmployees = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: apiMessages.error.unauthorized }); // Use clear unauthorized message
        }
        const { id } = req.user as UserPayload;

        const employees = await prisma.employee.findMany({
            where: { companyId: id }
        });
        if (!employees.length) {
            // Check if no employees are found
            return httpResponse(req, res, 200, apiMessages.employee.employeeNotFound, { data: [] }); // Return empty array
        }
        return httpResponse(req, res, 200, apiMessages.employee.employeesFound, { data: employees });
    } catch (error) {
        // Handle other errors using httpError
        return httpError(next, error, req, 500);
    }
};

export const getEmployeeById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: apiMessages.error.unauthorized }); // Use clear unauthorized message
        }
        const { id } = req.user as UserPayload;
        const { employeeId } = req.params;

        const employee = await prisma.employee.findUnique({
            where: {
                id: employeeId,
                companyId: id
            }
        });

        if (!employee) {
            return httpResponse(req, res, 404, apiMessages.employee.employeeNotFound, { data: [] });
        }
        return httpResponse(req, res, 200, apiMessages.employee.employeeFound, { data: employee });
    } catch (error) {
        return httpError(next, error, req, 500);
    }
};

export const updateEmployee = (_: Request, res: Response, next: NextFunction): void => {
    try {
        res.status(501).json({ message: 'Update employee not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};

export const deleteEmployee = (_: Request, res: Response, next: NextFunction): void => {
    try {
        res.status(501).json({ message: 'Delete employee not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};

export const blockEmployee = (_: Request, res: Response, next: NextFunction): void => {
    try {
        res.status(501).json({ message: 'Block employee not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};

export const activateEmployee = (_: Request, res: Response, next: NextFunction): void => {
    try {
        res.status(501).json({ message: 'Activate employee not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};

export const deactivateEmployee = (_: Request, res: Response, next: NextFunction): void => {
    try {
        res.status(501).json({ message: 'Deactivate employee not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};

//invitation
export const sendInvitation = (_: Request, res: Response, next: NextFunction): void => {
    try {
        res.status(501).json({ message: 'Send invitation not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};

export const verifyInvitation = (_: Request, res: Response, next: NextFunction): void => {
    try {
        res.status(501).json({ message: 'Verify invitation not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};

