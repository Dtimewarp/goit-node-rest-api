import express from 'express';
import multer from 'multer';

import {
	registerUser,
	loginUser,
	logoutUser,
	getCurrentUser,
	updateSubscription,
	resendVerificationEmail
} from '../controllers/authControllers.js';
import { verifyToken } from '../helpers/tokenVerify.js';
import { verifyEmail } from '../helpers/emailVerify.js';
import { updateAvatar } from '../controllers/usersControllers.js';

const authRouter = express.Router();
const upload = multer({ dest: 'tmp/' });

authRouter.post('/register', registerUser);

authRouter.get('/verify/:verificationToken', verifyEmail);
authRouter.post('/verify', resendVerificationEmail);

authRouter.post('/login', loginUser);
authRouter.post('/logout', verifyToken, logoutUser);
authRouter.get('/current', verifyToken, getCurrentUser);
authRouter.patch('/', verifyToken, updateSubscription);

authRouter.patch(
	'/avatars',
	verifyToken,
	upload.single('avatar'),
	updateAvatar
);

export default authRouter;
