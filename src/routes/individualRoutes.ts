import { Router } from 'express';
import { getProfile, individualChangePassword, individualLogin, individualSignup, updateIndividual } from '../controllers/individualController';
import { protect } from '../middlewares/authMiddleware';

const individualRouter = Router();
// Authentication Route (No auth middleware here)
individualRouter.post('/signup', individualSignup);
individualRouter.post('/login', individualLogin);

individualRouter.use(protect);
individualRouter.route('/me').get(getProfile).patch(updateIndividual);
individualRouter.patch('/change-password', individualChangePassword);

export default individualRouter;

