import { Request, Response, NextFunction } from 'express';
import { UserPayload } from '../types/tokensType';
import { generateTokens, verifyAccessToken, verifyRefreshToken } from '../utils/tokens/tokens';
import logger from '../utils/logger';
import apiMessages from '../constants/apiMessages';

// Extend Request interface to include tokenValue property
declare module 'express-serve-static-core' {
    interface Request {
        user?: UserPayload;
    }
}

// Main middleware to protect routes
export const protect = (req: Request, res: Response, next: NextFunction) => {
    let accessToken: string | undefined;
    let refreshToken: string | undefined;

    // 1. Extract Access Token from Authorization header
    if (req.headers.authorization?.startsWith('Bearer ')) {
        accessToken = req.headers.authorization.split(' ')[1];
    }

    // 2. Extract Refresh Token from cookies
    if (req.cookies?.refreshToken) {
        refreshToken = req.cookies.refreshToken;
    }

    // 3. If no tokens, return unauthorized
    if (!accessToken && !refreshToken) {
        return res.status(401).json({ message: apiMessages.auth.unauthenticated });
    }

    try {
        // 4a. Try verifying access token
        if (accessToken) {
            const decoded = verifyAccessToken(accessToken);
            if (decoded && typeof decoded === 'object' && 'id' in decoded && 'role' in decoded && 'accountType' in decoded) {
                req.user = decoded as UserPayload;
                return next();
            }
        }

        // 4b. Try verifying refresh token
        if (refreshToken) {
            const decodedRefreshToken = verifyRefreshToken(refreshToken);
            if (
                decodedRefreshToken &&
                typeof decodedRefreshToken === 'object' &&
                'id' in decodedRefreshToken &&
                'role' in decodedRefreshToken &&
                'accountType' in decodedRefreshToken
            ) {
                // Generate new tokens
                const newTokens = generateTokens({
                    id: decodedRefreshToken.id,
                    role: decodedRefreshToken.role,
                    accountType: decodedRefreshToken.accountType
                });

                // Set new tokens
                res.setHeader('Authorization', `Bearer ${newTokens.accessToken}`);
                res.cookie('refreshToken', newTokens.refreshToken, {
                    httpOnly: true,
                    sameSite: 'strict',
                    path: '/',
                    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
                });

                req.user = decodedRefreshToken as UserPayload;
                return next();
            } else {
                res.clearCookie('refreshToken');
                return res.status(401).json({ message: apiMessages.auth.tokenExpired });
            }
        }

        return res.status(401).json({ message: apiMessages.auth.unauthenticated });
    } catch (error) {
        logger.error('JWT Verification Error:', error);
        return res.status(401).json({ message: apiMessages.auth.invalidToken });
    }
};

// Middleware for admin-only access
export const protectAdmin = (req: Request, res: Response, next: NextFunction) => {
    protect(req, res, () => {
        if (req.user?.role === 'ADMIN') {
            return next();
        } else {
            return res.status(403).json({ message: apiMessages.error.unauthorized });
        }
    });
};

// Middleware for company-only access
export const protectCompany = (req: Request, res: Response, next: NextFunction) => {
    protect(req, res, () => {
        if (req.user?.role === 'COMPANY') {
            return next();
        } else {
            return res.status(403).json({ message: apiMessages.error.unauthorized });
        }
    });
};

