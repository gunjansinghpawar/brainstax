import express from "express";
import { changePasswordOnFirstLogin, login } from "../controllers/authController";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post("/login", login);
router.post("/change-password", auth, changePasswordOnFirstLogin);

export default router;
