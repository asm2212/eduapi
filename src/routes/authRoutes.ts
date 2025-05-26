import { Router } from 'express';
import { changePassword, getMe, login, logout, signup, updateMe } from '../controllers/authController'; // 👈 Make sure these exist

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
authRouter.post('/forgot-password');
authRouter.patch('/reset-password/:token'); // ✅

// Account Verification Routes
authRouter.post('/send-verification-email');
authRouter.get('/verify/:token');

export default authRouter;

