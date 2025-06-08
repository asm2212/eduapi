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
import hpp from 'hpp';

const app: Application = express();

// Middleware
//compress response for all routes
app.use(compression());
app.use(cookieParser());

//security middleware
app.use(helmet());

// Cross-Site Scripting (XSS) by controlling where resources can be loaded from
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:'],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: []
        }
    })
);
// XSS (Cross-Site Scripting) Protection
app.use(helmet.xssFilter()); // Enable XSS protection filter
// HSTS ensures browsers only communicate with your server over HTTPS
app.use(
    helmet.hsts({
        maxAge: 31536000, // 1 year
        includeSubDomains: true, // Include subdomains
        preload: true // Optional: for preloading HSTS with browsers
    })
);
// Setting a strict referrer policy can prevent leaking sensitive information in the Referer header to other domains
app.use(helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' }));
app.disable('x-powered-by');
app.use(cors());
app.use(express.json({ limit: '25kb' })); // Parse JSON bodies
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

// Protect against HPP, should come before any routesAdd commentMore actions
app.use(hpp());

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

