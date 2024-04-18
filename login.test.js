import { loginUser } from './controllers/authControllers.js';
import { User } from './db/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const req = { body: { email: 'test@example.com', password: 'password' } };
const res = {
	status: jest.fn().mockReturnThis(),
	json: jest.fn(),
};

describe('Login Controller', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test('should respond with status code 200, token, and user object', async () => {
		const mockUser = {
			email: 'test@example.com',
			password: 'hashed_password',
			subscription: 'premium',
			_id: 'user_id',
			save: jest.fn(),
		};
		User.findOne = jest.fn().mockResolvedValue(mockUser);
		bcrypt.compare.mockResolvedValue(true);
		jwt.sign.mockReturnValue('fake_token');

		await loginUser(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			token: 'fake_token',
			user: { email: 'test@example.com', subscription: 'premium' },
		});
	});

	test('should respond with status code 401 when email or password is wrong', async () => {
		User.findOne = jest.fn().mockResolvedValue(null);
		bcrypt.compare.mockResolvedValue(false);

		await loginUser(req, res);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Email or password is wrong',
		});
	});

	test('should respond with status code 500 if an error occurs', async () => {
		User.findOne = jest.fn().mockRejectedValue(new Error('Server Error'));

		await loginUser(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({ message: 'Server Error' });
	});
});
