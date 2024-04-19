import jimp from 'jimp';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';

import { User } from '../db/userModel.js';

export const processAvatar = async (avatarFile) => {
    try {

        const image = await jimp.read(avatarFile.path);
        await image.resize(250, 250).writeAsync(avatarFile.path);

        const fileName = `${uuidv4()}${path.extname(avatarFile.originalname)}`;

        await fs.rename(avatarFile.path, `public/avatars/${fileName}`);

        const avatarURL = `/avatars/${fileName}`;
        return avatarURL;
    } catch (error) {
        throw new Error("Failed to process avatar");
    }
};

// export const processAvatar = async (avatarFile, userId) => {
// 	try {
// 		const user = await User.findById(userId);

// 		if (!user) {
// 			throw new Error('User not found');
// 		}

// 		console.log('User ID:', user._id);

// 		const image = await jimp.read(avatarFile.path);
// 		await image.resize(250, 250).writeAsync(avatarFile.path);

// 		const fileName = `${uuidv4()}${path.extname(avatarFile.originalname)}`;

// 		const userAvatarFolderPath = `public/avatars/${userId}`;
// 		try {
// 			await fs.access(userAvatarFolderPath);
// 		} catch (error) {
// 			await fs.mkdir(userAvatarFolderPath, { recursive: true });
// 		}

// 		await fs.rename(avatarFile.path, `${userAvatarFolderPath}/${fileName}`);

// 		const avatarURL = `/avatars/${userId}/${fileName}`;
// 		return avatarURL;
// 	} catch (error) {
// 		console.error(error);
// 		throw new Error('Failed to process avatar');
// 	}
// };
