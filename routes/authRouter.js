import express from "express";
import {registerUser, loginUser, logoutUser, getCurrentUser, updateSubscription} from '../controllers/authControllers.js';
import { verifyToken } from "../helpers/tokenCheck.js";


const authRouter = express.Router();

authRouter.post("/register",  registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", verifyToken, logoutUser)
authRouter.get("/current", verifyToken, getCurrentUser )
authRouter.patch('/', verifyToken, updateSubscription)

export default authRouter; 