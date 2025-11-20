import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  name: string;
  description: string;
  assignedTo: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  dueDate: Date;
  status: "pending" | "in-progress" | "completed";
}

const taskSchema = new Schema<ITask>(
  {
    name: {
      type: String,
      required: [true, "Task name is required"],
    },

    description: {
      type: String,
      required: true,
    },

    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company reference is required"],
    },

    dueDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITask>("Task", taskSchema);
