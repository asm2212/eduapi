import express, { Application, Request, Response, NextFunction } from 'express';
import globalErrorHandler from './middlewares/globalErrorHandler';
import httpError from './utils/httpError';
import responseMessage from './constants/responseMessage';
import helmet from 'helmet';
import router from './routes/apiRoutes';
import cors from 'cors';
import authRouter from './routes/authRoutes';
import adminRouter from './routes/adminRoutes';
import companyRouter from './routes/companyRoutes';
import employeeRouter from './routes/employeeRoutes';
import rateLimit from 'express-rate-limit';
// import compression from 'compression';
import cookieParser from 'cookie-parser';
import individualRouter from './routes/individualRoutes';
import compression from 'compression';

const app: Application = express();

// Middleware
//compress response for all routes
app.use(compression());
app.use(cookieParser());
app.use(helmet());
// app.use(
//     cors({
//         methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
//         origin: ['*'],
//         credentials: true
//     })
// );

// app.use(express.json({ limit: '16kb' })); // Limit JSON body size to 16kb
// app.use(express.urlencoded({ extended: true, limit: '16kb' })); // Limit URL-encoded body size to 16kb
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '25kb' })); // Parse URL-encoded bodies
// Rate Limiting Configuration
const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many requests from this IP, please try again later.'
    }
});

// Apply rate limiting globally
app.use(rateLimiter);

// Routes
app.use('/api/v1', router);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/company', companyRouter);
app.use('/api/v1/employee', employeeRouter);
app.use('/api/v1/individual', individualRouter); // individual router

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

