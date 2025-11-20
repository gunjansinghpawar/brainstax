import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import * as taskService from "../services/taskService";

// Create Task - Only COMPANY can create
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    // Ensure only company admin can create tasks
    if (!req.user || req.user.role !== "companyadmin") {
      return res.status(403).json({
        success: false,
        message: "Only company admin can create tasks",
      });
    }

    // Build task payload with companyId from user's JWT
    const taskData = {
      ...req.body,
      companyId: req.user.companyId, // From token
      createdBy: req.user.id,        // Optional but recommended
    };

    const task = await taskService.createTask(taskData);

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update task status
export const updateTaskStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await taskService.updateTaskStatus(id, status);

    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: task,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
