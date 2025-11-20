import mongoose from "mongoose";
import Task from "../models/Task";
import User from "../models/User";

export const createTask = async (data: any) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, description, assignedTo, companyId, dueDate } = data;

    // Ensure assigned user exists
    const user = await User.findById(assignedTo);
    if (!user) {
      throw new Error("Assigned user does not exist");
    }

    const task = await Task.create(
      [
        {
          name,
          description,
          assignedTo,
          companyId,
          dueDate,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return task[0];
  } catch (err: unknown) {
    await session.abortTransaction();
    session.endSession();
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const updateTaskStatus = async (taskId: string, status: string) => {
  if (!["pending", "in-progress", "completed"].includes(status)) {
    throw new Error("Invalid task status");
  }

  const task = await Task.findByIdAndUpdate(
    taskId,
    { status },
    { new: true }
  );

  if (!task) throw new Error("Task not found");

  return task;
};

export const deleteTask = async (taskId: string) => {

  const task = await Task.findByIdAndDelete(taskId);

  if (!task) throw new Error("Task not found");
  return task;
}

