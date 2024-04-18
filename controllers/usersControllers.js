import { addAvatarURLToUser } from "../helpers/addURLavatar.js";
import { processAvatar } from "../services/usersService.js";

export const updateAvatar = async (req, res) => {
    try {
        // Перевірка, чи був завантажений файл
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        // Отримання userId з авторизаційного токену
        const userId = req.user.id;
        // Обробка аватару з передачею userId
        const avatarURL = await processAvatar(req.file, userId);
        
        // Отримання URL аватару та збереження його в базі даних користувача
        req.body.avatarURL = avatarURL;

        // Виклик мідлвари для додавання URL аватару до користувача
        addAvatarURLToUser(req, res, () => {
            // Отримання URL аватару з мідлвари та відправлення відповіді клієнту
            res.status(200).json({ avatarURL });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};
