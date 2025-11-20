import express from "express";
import * as userController from "../controllers/userController";
import { auth, authorizeRoles } from "../middleware/auth";

const router = express.Router();

router.get("/", auth, authorizeRoles("superadmin"), userController.getUsers);
router.post("/create", auth, userController.createUser);
router.get("/:id", auth,userController.getUserById);
router.put("/:id", auth, userController.updateUser);
router.delete("/:id", auth, userController.deleteUser);

export default router;
