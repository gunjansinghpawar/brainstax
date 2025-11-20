import mongoose, { Document, Schema } from "mongoose";

export interface IEmployee extends Document {
  userId: mongoose.Types.ObjectId; // Reference to User
  companyId: mongoose.Types.ObjectId; // Reference to Company
  name: string;
  department: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema: Schema<IEmployee> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"]
    },

    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company ID is required"]
    },

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },

    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes for faster queries
EmployeeSchema.index({ userId: 1 });
EmployeeSchema.index({ companyId: 1 });
EmployeeSchema.index({ department: 1 });

// Ensure one employee record per user per company
EmployeeSchema.index({ userId: 1, companyId: 1 }, { unique: true });

export default mongoose.model<IEmployee>("Employee", EmployeeSchema);