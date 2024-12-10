import express from 'express';
import { userLoginStatus, updateUser, getUser, loginUser, registerUser, logoutUser } from '../controllers/auth/userController.js';
import { creatorMiddleware, adminMiddleware, protect } from '../middleware/authMiddleware.js';
import { getAllUsers, deleteUser } from '../controllers/auth/adminController.js';


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/user", protect, getUser);
router.patch("/user", protect, updateUser);

//admin routes
router.delete("/admin/users/:id", protect, adminMiddleware, deleteUser);
router.get("/admin/users", protect, creatorMiddleware, getAllUsers);

//login status
router.get("/login-status", userLoginStatus);

export default router;