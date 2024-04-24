import { User } from '../db/userModel.js';

// export const verifyEmail = async (req, res) => {
// 	let { verificationToken } = req.params;

// 	if (verificationToken.startsWith(':')) {
//         verificationToken = verificationToken.substring(1);
//     }

// 	console.log(verificationToken);

// 	try {
// 		const user = await User.findOne({ verificationToken });

// 		if (!user) {
// 			return res.status(404).json({ message: 'User not found' });
// 		}

// 		// Встановлюємо verificationToken в null і verify в true
// 		user.verificationToken = null;
// 		user.verify = true;
// 		await user.save();

// 		return res.status(200).json({ message: 'Verification successful' });
// 	} catch (error) {
// 		console.error(error);
// 		return res.status(500).json({ message: error });
// 	}
// };

export const verifyEmail = async (req, res) => {
	const { verificationToken } = req.params;
	const user = await User.findOne({ verificationToken });

	if (!user) {
		return res.status(404).json({ message: 'User not found' });
	}

	await User.findByIdAndUpdate(user._id, {
		verify: true,
		verificationToken: null,
	});
	
	res.status(200).json({ message: 'Verification successful' });
};

	