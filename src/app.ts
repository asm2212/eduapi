import express, { Application, Request, Response, NextFunction } from 'express';
import globalErrorHandler from './middlewares/globalErrorHandler';
import httpError from './utils/httpError';
import responseMessage from './constants/responseMessage';
import helmet from 'helmet';
import router from './routes/apiRoutes';
import cors from 'cors';
import authRouter from './routes/authRoutes';

const app: Application = express();

// Middleware
app.use(helmet());
app.use(
    cors({
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
        origin: ['https://client.com'],
        credentials: true
    })
);

app.use(express.json());

// Routes
app.use('/api/v1', router);
app.use('/api/v1/auth', authRouter);

// 404 Handler
app.use((req: Request, _: Response, next: NextFunction) => {
    try {
        throw new Error(responseMessage.NOT_FOUND('route'));
    } catch (err) {
        httpError(next, err, req, 404);
    }
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;

