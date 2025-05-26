import { Router } from 'express';
import { self, health } from '../controllers/apiController';

const router = Router();

router.get('/self', self);
router.get('/health', health);

export default router;

