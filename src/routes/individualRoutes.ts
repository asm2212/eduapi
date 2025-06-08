import { Router } from 'express';
import {
    getProfile,
    individualChangePassword,
    individualLogin,
    individualLogout,
    individualSignup,
    resetIndividualPassword,
    sendIndividualResetPasswordMail,
    sendIndividualVerificationMail,
    updateIndividual,
    verifyIndividualAccount
} from '../controllers/individualController';
import { protect } from '../middlewares/authMiddleware';

const individualRouter = Router();
// Authentication Route (No auth middleware here)
individualRouter.post('/signup', individualSignup);
individualRouter.post('/login', individualLogin);
individualRouter.get('/logout', individualLogout);
individualRouter.patch('/verify-account', sendIndividualVerificationMail);
individualRouter.patch('/verify/:token', verifyIndividualAccount);
individualRouter.patch('/forget-password', sendIndividualResetPasswordMail);
individualRouter.patch('/reset-password/:token', resetIndividualPassword);

individualRouter.use(protect);
individualRouter.route('/me').get(getProfile).patch(updateIndividual);
individualRouter.patch('/change-password', individualChangePassword);

export default individualRouter;

