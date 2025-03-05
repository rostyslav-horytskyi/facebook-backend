import express from 'express';
import {
    register,
    activateAccount,
    login,
    getCurrentUser,
    resendVerification,
    findUser,
    sendResetPasswordCode,
    validateResetCode,
    changePassword
} from '../controllers/user';
import {authUser} from "../middlewares/auth";

const router = express.Router();

router.post('/register', register);
router.post('/activate', authUser, activateAccount);
router.post('/login', login);
router.get('/user', authUser, getCurrentUser);
router.post('/resend-verification', authUser, resendVerification);
router.post("/find-user", findUser);
router.post("/send-reset-password-code", sendResetPasswordCode);
router.post("/validate-reset-code", validateResetCode);
router.post("/change-password", changePassword);


export default router;
