import mongoose, { Document, Schema } from "mongoose";

export interface IDepartment {
  name: string;
  description?: string;
}

export interface ICompany extends Document {
  name: string;
  email: string;
  address: string;
  phone: string;
  companyAdmin: mongoose.Types.ObjectId; // Reference to User
  employees: mongoose.Types.ObjectId[]; // Reference to User
  departments: IDepartment[];
  createdAt: Date;
  updatedAt: Date;
}

const DepartmentSchema = new Schema<IDepartment>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    }
  },
  { _id: false }
);

const CompanySchema: Schema<ICompany> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true
    },

    email: {
      type: String,
      required: [true, "Company email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"]
    },

    address: {
      type: String,
      required: [true, "Company address is required"],
      trim: true
    },

    phone: {
      type: String,
      required: [true, "Company phone is required"],
      trim: true
    },

    companyAdmin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Company admin is required"]
    },

    employees: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    departments: {
      type: [DepartmentSchema],
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
CompanySchema.index({ email: 1 });
CompanySchema.index({ companyAdmin: 1 });

export default mongoose.model<ICompany>("Company", CompanySchema);