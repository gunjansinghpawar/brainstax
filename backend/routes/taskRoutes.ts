import express from "express";
import { auth, authorizeRoles } from "../middleware/auth";
import { createTask, updateTaskStatus } from "../controllers/taskController";

const router = express.Router();

// Create task - only company role
router.post(
  "/",
  auth,
  authorizeRoles("companyadmin"),
  createTask
);

// Update task status
router.patch(
  "/:id/status",
  auth,
  authorizeRoles("companyadmin", "employee"),
  updateTaskStatus
);

export default router;
