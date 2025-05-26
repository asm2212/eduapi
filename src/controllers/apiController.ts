import httpResponse from '../utils/httpResponse';
import httpError from '../utils/httpError';
import { Request, Response, NextFunction } from 'express';
import responseMessage from '../constants/responseMessage';
import { getApplicationHealth, getSystemHealth } from '../utils/quicker';

/**
 * Self-check endpoint - Checks the basic functionality of the API.
 */
export const self = (req: Request, res: Response, next: NextFunction) => {
    try {
        httpResponse(req, res, 200, responseMessage.SUCCESS);
    } catch (error) {
        httpError(next, error, req, 500);
    }
};
/**


 * Health check endpoint - Provides details about the application and system health.
 */
export const health = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const healthData = await Promise.all([getApplicationHealth(), getSystemHealth()]);
        httpResponse(req, res, 200, responseMessage.SUCCESS, { application: healthData[0], system: healthData[1] });
    } catch (error) {
        httpError(next, error, req, 500);
    }
};

