import { User } from '../db/userModel.js';

export const addAvatarURLToUser = async (req, res, next) => {
	try {
		// Отримуємо URL аватару з запиту
		const { avatarURL } = req.body;

		// Отримуємо ID користувача з авторизаційного токену
		const userId = req.user.id;

		// Оновлюємо користувача в базі даних, додаючи URL аватару
		const updatedUser = await User.findOneAndUpdate(
			{ _id: userId },
			{ $set: { avatarURL } },
			{ new: true }
		);

		// Перевіряємо, чи користувач знайдений
		if (!updatedUser) {
			return res.status(404).json({ message: 'User not found' });
		}

		// Передаємо оновленого користувача у наступний маршрут або контролер
		req.user = updatedUser;

		// Продовжуємо виконання наступних операцій
		next();
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server Error' });
	}
};
