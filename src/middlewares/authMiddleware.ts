import { Request, Response, NextFunction } from 'express';
import { UserPayload } from '../types/tokensType';
import { verifyAccessToken } from '../utils/tokens/tokens';
import logger from '../utils/logger';
import apiMessages from '../constants/apiMessages';

// Extend Request interface to include tokenValue property

declare module 'express-serve-static-core' {
    interface Request {
        user?: UserPayload;
    }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
    let token;
    // Check if the Authorization header exists and starts with "Bearer "

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        try {
            // Extract the token (remove "Bearer ")
            token = req.headers.authorization.split(' ')[1];

            // Verify the token
            const decoded = verifyAccessToken(token);

            if (decoded) {
                // Type guard and type assertion

                if (typeof decoded === 'object' && 'id' in decoded && 'role' in decoded && 'accountType' in decoded) {
                    req.user = decoded as UserPayload;

                    return next();
                } else {
                    logger.error('Invalid token payload structure:', decoded); // Log the incorrect payload

                    return res.status(401).json({ message: apiMessages.auth.invalidTokenFormat });
                }
            } else {
                return res.status(401).json({ message: apiMessages.auth.invalidToken });
            }
        } catch (error) {
            logger.error('JWT Verification Error:', error); // Log the error on the server

            return res.status(401).json({ message: apiMessages.auth.invalidToken }); // Return a 401 even if there is an error during verification
        }
    } else {
        return res.status(401).json({ message: apiMessages.auth.invalidToken });
    }
};

