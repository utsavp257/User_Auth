import express from 'express';
import { updateUser, getUser, loginUser, registerUser, logoutUser } from '../controllers/auth/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/user", protect, getUser);
router.patch("/user", protect, updateUser);

export default router;