import { User } from '../db/userModel.js';

export const addAvatarURLToUser = async (req, res, next) => {
	try {
		const { avatarURL } = req.body;
		const userId = req.user.id;
		const updatedUser = await User.findOneAndUpdate(
			{ _id: userId },
			{ $set: { avatarURL } },
			{ new: true }
		);

		if (!updatedUser) {
			return res.status(404).json({ message: 'User not found' });
		}

		req.user = updatedUser;

		next();
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server Error' });
	}
};
