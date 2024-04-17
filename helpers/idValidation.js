import { Types } from 'mongoose';

export const isValidId = (req, res, next) => {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: `${id} is not a valid ObjectId` });     
    }
    next();
};