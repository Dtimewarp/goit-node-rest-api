import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import { registerSchema, loginSchema } from '../schemas/authSchemas.js';
import { User } from '../db/userModel.js';
import sendVerificationEmail from '../helpers/sendVerificationEmail.js';

// export const registerUser = async (req, res) => {
// 	try {
// 		const { error } = registerSchema.validate(req.body);
// 		if (error) {
// 			return res.status(400).json({ message: error.details[0].message });
// 		}

// 		const { email, password } = req.body;

// 		const existingUser = await User.findOne({ email });
// 		if (existingUser) {
// 			return res.status(409).json({ message: 'Email in use' });
// 		}

// 		const hashedPassword = await bcrypt.hash(password, 10);

// 		const user = new User({ email, password: hashedPassword });
// 		await user.save();

// 		res.status(201).json({
// 			user: {
// 				email: user.email,
// 				subscription: user.subscription,
// 			},
// 		});
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json({ message: 'Server Error' });
// 	}
// };
export const registerUser = async (req, res) => {
	try {
		const { error } = registerSchema.validate(req.body);
		if (error) {
			return res.status(400).json({ message: error.details[0].message });
		}

		const { email, password } = req.body;

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(409).json({ message: 'Email in use' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const verificationToken = uuidv4();
		const user = new User({ email, password: hashedPassword, verificationToken });
		await user.save();

		await sendVerificationEmail(email, verificationToken);

		res.status(201).json({
			message: 'User created successfully. Please verify your email.',
			user: {
				email: user.email,
				subscription: user.subscription,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server Error' });
	}
};

// export const loginUser = async (req, res) => {
// 	const { SECRET_KEY } = process.env;

// 	const { error } = loginSchema.validate(req.body);
// 	if (error) {
// 		return res.status(400).json({ message: error.details[0].message });
// 	}

// 	const { email, password } = req.body;

// 	try {
// 		const user = await User.findOne({ email });

// 		if (!user) {
// 			return res.status(401).json({ message: 'Email or password is wrong' });
// 		}

// 		const isPasswordValid = await bcrypt.compare(password, user.password);
// 		if (!isPasswordValid) {
// 			return res.status(401).json({ message: 'Email or password is wrong' });
// 		}

// 		const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
// 			expiresIn: '12h',
// 		});

// 		user.token = token;
// 		await user.save();

// 		res.status(200).json({
// 			token,
// 			user: { email: user.email, subscription: user.subscription },
// 		});
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json({ message: 'Server Error' });
// 	}
// };
export const loginUser = async (req, res) => {
	const { SECRET_KEY } = process.env;

	const { error } = loginSchema.validate(req.body);
	if (error) {
		return res.status(400).json({ message: error.details[0].message });
	}

	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(401).json({ message: 'Email or password is wrong' });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({ message: 'Email or password is wrong' });
		}

		// Перевірка, чи підтверджена електронна пошта
		if (!user.verify) {
			return res.status(401).json({ message: 'Email is not verified' });
		}

		const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
			expiresIn: '12h',
		});

		await User.findByIdAndUpdate(user._id, { token });

		res.status(200).json({
			token,
			user: { email: user.email, subscription: user.subscription },
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server Error' });
	}
};

export const logoutUser = async (req, res) => {
	try {
		if (!req.user) {
			return res.status(401).json({ message: 'Not authorized' });
		}

		const userId = req.user._id;
		const user = await User.findById(userId);

		if (!user) {
			return res.status(401).json({ message: 'Not authorized' });
		}

		user.token = null;
		await user.save();

		return res.status(204).end();
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Server Error' });
	}
};

export const getCurrentUser = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId);

		if (!user) {
			return res.status(401).json({ message: 'Not authorized' });
		}

		return res.status(200).json({
			email: user.email,
			subscription: user.subscription,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Server Error' });
	}
};

export const updateSubscription = async (req, res) => {
	const allowedSubscriptions = ['starter', 'pro', 'business'];
	const { subscription } = req.body;

	if (!allowedSubscriptions.includes(subscription)) {
		return res.status(400).json({ message: 'Invalid subscription type' });
	}

	try {
		req.user.subscription = subscription;
		await req.user.save();

		res.status(200).json({
			message: 'Subscription updated successfully',
			subscription: req.user.subscription,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server Error' });
	}
};

export const resendVerificationEmail = async (req, res) => {
    try {
        
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Missing required field email' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.verify) {
            return res.status(400).json({ message: 'Verification has already been passed' });
        }

        const verificationToken = user.verificationToken;
        await sendVerificationEmail(email, verificationToken);

        res.status(200).json({ message: 'Verification email sent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

