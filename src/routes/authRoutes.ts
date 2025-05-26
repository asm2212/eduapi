import { Router } from 'express';
import { changePassword, getMe, login, logout, signup, updateMe } from '../controllers/authController';
const authRouter = Router();

// Authentication Routes
authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.post('/logout', logout);

// User Profile Routes
authRouter.get('/me', getMe);
authRouter.patch('/me', updateMe);

// Password Management Routes
authRouter.patch('/change-password', changePassword);
authRouter.post('/forgot-password'); // Initiate password reset (send token)
authRouter.patch('/reset-password/:token'); // Reset password using token

// Account Verification Routes
authRouter.post('/send-verification-email'); // Request a new verification email
authRouter.get('/verify/:token'); // Verify account using token

export default authRouter;
