import jimp from "jimp";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";

import {User} from "../db/userModel.js";

// export const processAvatar = async (avatarFile) => {
//     try {
//         // Обробка зображення з допомогою jimp
//         const image = await jimp.read(avatarFile.path);
//         await image.resize(250, 250).writeAsync(avatarFile.path);

//         // Генерація унікального імені файлу
//         const fileName = `${uuidv4()}${path.extname(avatarFile.originalname)}`;

//         // Переміщення обробленого зображення в папку public/avatars з унікальним ім'ям
//         await fs.rename(avatarFile.path, `public/avatars/${fileName}`);

//         // Повернення URL зображення
//         const avatarURL = `/avatars/${fileName}`;
//         return avatarURL;
//     } catch (error) {
//         throw new Error("Failed to process avatar");
//     }
// };

export const processAvatar = async (avatarFile, userId) => {
    try {
        // Отримуємо користувача за його _id з бази даних
        const user = await User.findById(userId);

        // Перевіряємо, чи знайдений користувач з вказаним _id
        if (!user) {
            throw new Error("User not found");
        }

        console.log("User ID:", user._id);

        // Обробка зображення з допомогою jimp
        const image = await jimp.read(avatarFile.path);
        await image.resize(250, 250).writeAsync(avatarFile.path);

        // Генерація унікального імені файлу
        const fileName = `${uuidv4()}${path.extname(avatarFile.originalname)}`;

        // Перевірка існування папки користувача, якщо не існує - створення
        const userAvatarFolderPath = `public/avatars/${userId}`;
        try {
            await fs.access(userAvatarFolderPath);
        } catch (error) {
            await fs.mkdir(userAvatarFolderPath, { recursive: true });
        }

        // Переміщення обробленого зображення в папку користувача з унікальним ім'ям
        await fs.rename(avatarFile.path, `${userAvatarFolderPath}/${fileName}`);

        // Повернення URL зображення
        const avatarURL = `/avatars/${userId}/${fileName}`;
        return avatarURL;
    } catch (error) {
        console.error(error)
        throw new Error("Failed to process avatar");
    }
};




