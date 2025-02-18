import express from 'express';
import {register, activateAccount, login, getCurrentUser} from '../controllers/user';
import {authUser} from "../middlewares/auth";

const router = express.Router();

router.post('/register', register);
router.post('/activate', authUser, activateAccount);
router.post('/login', login);
router.get('/user', authUser, getCurrentUser);

export default router;
