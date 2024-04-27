import jwt from 'jsonwebtoken';
import { User } from '../db/userModel.js';

export const verifyToken = async (req, res, next) => {
	const { SECRET_KEY } = process.env;

	const token = req.headers.authorization?.split(' ')[1];

	if (!token) {
		return res.status(401).json({ message: 'Not authorized' });
	}

	try {
		const decodedToken = jwt.verify(token, SECRET_KEY);
		const userId = decodedToken.userId;
		// console.log(userId);

		const user = await User.findById(userId);

		if (!user || user.token !== token) {
			return res.status(401).json({ message: 'Not authorized' });
		}

		req.user = user;
		next();
	} catch (error) {
		console.error(error);
		return res.status(401).json({ message: 'Not authorized' });
	}
};
