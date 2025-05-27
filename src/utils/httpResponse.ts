import { Request, Response } from 'express';
import logger from './logger';
import config from '../configs/config';
import { EApplicationEnvironment } from '../constants/application';

// HTTP response handler
//  * @param req - Express Request object
//  * @param res - Express Response object
//  * @param statusCode - HTTP status code
//  * @param message - Response message
//  * @param data - Optional data to include in the response
//  *
const httpResponse = (req: Request, res: Response, statusCode: number, message: string, data: unknown = null): void => {
    // Construct the response object
    const response = {
        success: statusCode >= 200 && statusCode < 300,
        statusCode,
        request: {
            ip: config.ENV === EApplicationEnvironment.PRODUCTION ? null : req.ip,
            method: req.method,
            url: req.originalUrl
        },
        message,
        data
    };

    // log
    logger.info('CONTROLLER RESPONSE', {
        meta: response
    });

    // send the response
    res.status(statusCode).json(response);
};

export default httpResponse;
