import { registerSchema, loginSchema } from "../schemas/authSchemas.js";
import { User } from "../db/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



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
  
      const user = new User({ email, password: hashedPassword });
      await user.save();
  
      res.status(201).json({
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

export const loginUser = async (req, res) => {
  const {SECRET_KEY} = process.env;

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
  
      const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '12h' });
  
      res.status(200).json({ token, user: { email: user.email, subscription: user.subscription } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
};
  
export const logoutUser = async (req, res, next) => {
  try {
    // Перевірка, чи існує користувач в req.user
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized-1' });
    }

    // Отримання id користувача з об'єкта req
    const userId = req.user._id;

    // Пошук користувача за id
    const user = await User.findById(userId);

    // Перевірка наявності користувача
    if (!user) {
      return res.status(401).json({ message: 'Not authorized-2' });
    }

    // Видалення токена у користувача
    user.token = null;
    await user.save();

    // Відправка успішної відповіді
    return res.status(204).end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
      // Отримання id користувача з об'єкта req, який був доданий під час перевірки токена
      const userId = req.user._id;

      // Пошук користувача за id
      const user = await User.findById(userId);

      // Перевірка наявності користувача
      if (!user) {
          return res.status(401).json({ message: 'Not authorized' });
      }

      // Відправка даних користувача у відповідь
      return res.status(200).json({
          email: user.email,
          subscription: user.subscription
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server Error' });
  }
};