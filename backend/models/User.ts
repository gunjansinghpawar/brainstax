

import mongoose, { Document, Schema } from "mongoose";

export type Role = "superadmin" | "companyadmin" | "employee";

export interface IUser extends Document {
  name: string;
  email?: string; // Optional because company email not stored for company entity
  password: string;
  role: Role;
  isFirstLogin: boolean;
  companies: mongoose.Types.ObjectId[]; // Companies associated with user
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },

    email: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null emails
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"]
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"]
    },

    role: {
      type: String,
      enum: {
        values: ["superadmin", "companyadmin", "employee"],
        message: "{VALUE} is not a valid role"
      },
      default: "employee",
      required: true
    },

    isFirstLogin: {
      type: Boolean,
      default: true
    },

    companies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Company"
      }
    ]
  },
  {
    timestamps: true,
    // toJSON: {
    //   transform: (_doc, ret) => {
    //     delete req.user.id;

    //     return ret;
    //   }
    // }
  }
);

// Index for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

export default mongoose.model<IUser>("User", UserSchema);