import express from 'express';
import {
	registerUser,
	loginUser,
	logoutUser,
	getCurrentUser,
	updateSubscription,
} from '../controllers/authControllers.js';
import { verifyToken } from '../helpers/tokenCheck.js';
import multer from 'multer';
import { updateAvatar } from '../controllers/usersControllers.js';

const authRouter = express.Router();
const upload = multer({ dest: 'tmp/' });

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/logout', verifyToken, logoutUser);
authRouter.get('/current', verifyToken, getCurrentUser);
authRouter.patch('/', verifyToken, updateSubscription);

authRouter.patch('/avatars', verifyToken, upload.single('avatar'), updateAvatar);

export default authRouter;
