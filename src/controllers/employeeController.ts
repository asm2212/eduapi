import { Request, Response, NextFunction } from 'express';
import httpError from '../utils/httpError';
import httpResponse from '../utils/httpResponse';
import apiMessages from '../constants/apiMessages';
import { UserPayload } from '../types/tokensType';
import { generateTokens } from '../utils/tokens/tokens';
import comparePassword from '../utils/comparePassword';
import { employeeLoginSchema, employeeUpdateSchema } from '../validator/employeeValidator';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Controller for employee login

export const employeeLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = await employeeLoginSchema.parseAsync(req.body);
        const employee = await prisma.employee.findUnique({
            where: {
                email
            }
        });
        if (!employee) {
            return httpResponse(req, res, 404, apiMessages.employee.employeeNotFound);
        }
        const isPasswordCorrect = await comparePassword(password, employee.password);
        if (!isPasswordCorrect) {
            return httpResponse(req, res, 401, apiMessages.auth.wrongCredentials);
        }
        const payload: UserPayload = {
            id: employee.id,
            role: employee.role,
            accountType: employee.accountType
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
                id: employee.id,
                fullName: employee.fullName,
                email: employee.email,
                phone: employee.phone,
                address: employee.address,
                accountType: employee.accountType,
                social: employee.socialLinks,
                description: employee.description,
                role: employee.role,
                status: employee.status,
                isVerified: employee.isVerified,
                userAgent: employee.userAgent,
                createdAt: employee.createdAt,
                token: accessToken
            }
        });
    } catch (error) {
        return httpError(next, error, req, 500);
    }
};

export const employeeLogout = (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie('refreshToken', {
            httpOnly: true, // Important: must match cookie options from setting
            // secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict', // Important: must match cookie options from setting
            path: '/' // If your cookie had a path set, include it here
        });
        return httpResponse(req, res, 200, apiMessages.success.loggedOut, { data: [] });
    } catch (error) {
        return httpError(next, error, req, 500);
    }
};

// Controller for getting the current employee's profile

export const employeeProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Implement logic to retrieve the employee's profile based on the authenticated user
        res.status(501).json({ message: 'Get employee profile not implemented' }); // Placeholder
        if (!req.user) {
            res.status(401).json({ message: apiMessages.error.unauthorized }); // Use clear unauthorized message
        }
        const { id } = req.user as UserPayload;
        const user = await prisma.employee.findUnique({
            where: { id }
        });
        return httpResponse(req, res, 200, apiMessages.success.fetched, user);
    } catch (error) {
        return httpError(next, error, req, 500);
    }
};

// controller for getting the current employee's profile
export const getMe = (_: Request, res: Response, next: NextFunction): void => {
    try {
        res.status(501).json({ message: 'Get employee profile not implemented yet' });
    } catch (error) {
        next(error); // Important: Pass errors to the error handling middleware
    }
};
// Controller for updating the current employee's profile

export const employeeUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Implement logic to update the employee's profile
        res.status(501).json({ message: 'Update employee profile not implemented' }); // Placeholder
        if (!req.user) {
            res.status(401).json({ message: apiMessages.error.unauthorized }); // Use clear unauthorized message
        }
        const { id } = req.user as UserPayload; // Destructure user ID for clarityAdd commentMore actions
        const employeeData = await employeeUpdateSchema.parseAsync(req.body);
        const updatedEmployee = await prisma.employee.update({
            where: {
                id: id
            },
            data: employeeData
        });
        return httpResponse(req, res, 200, apiMessages.success.updated, updatedEmployee);
    } catch (error) {
        return httpError(next, error, req, 500);
    }
};

