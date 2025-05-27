import { NextFunction, Request } from 'express';
import { EApplicationEnvironment } from '../constants/application';
import config from '../configs/config';
import responseMessage from '../constants/responseMessage';
import logger from './logger';

const httpError = (nextFunc: NextFunction, err: unknown, req: Request, errorstatusCode: number = 500): void => {
    // contruct the error object
    const errorObj = {
        success: false,
        statusCode: errorstatusCode,
        request: {
            ip: config.ENV === EApplicationEnvironment.PRODUCTION ? null : req.ip,
            method: req.method,
            url: req.originalUrl
        },
        message: err instanceof Error ? err.message || responseMessage.SOMETHING_WENT_WRONG : responseMessage.SOMETHING_WENT_WRONG,
        data: null,
        trace: config.ENV === EApplicationEnvironment.PRODUCTION ? null : { error: err instanceof Error ? err.stack : null }
    };

    // log the error
    logger.error('CONTROLLER ERROR', {
        meta: errorObj
    });
    // pass the error to the next middleware
    nextFunc(errorObj);
};

export default httpError;

