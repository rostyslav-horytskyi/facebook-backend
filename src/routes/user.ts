import express from 'express';
import { register, activateAccount, login } from '../controllers/user';

const router = express.Router();

router.post('/register', register);
router.post('/verify', activateAccount);
router.post('/login', login);

export default router;
