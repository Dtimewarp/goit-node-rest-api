import { addAvatarURLToUser } from '../helpers/addURLavatar.js';
import { processAvatar } from '../services/usersService.js';

export const updateAvatar = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: 'No file uploaded' });
		}
		const userId = req.user.id;
		const avatarURL = await processAvatar(req.file, userId);

		req.body.avatarURL = avatarURL;

		addAvatarURLToUser(req, res, () => {
			res.status(200).json({ avatarURL });
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server Error' });
	}
};
