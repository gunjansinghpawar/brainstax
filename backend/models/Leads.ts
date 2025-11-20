// import mongoose, { Document, Schema } from "mongoose";

// export interface ILead extends Document {
//   name: string;
//   email: string;
//   phone: string;
//   address?: string;
//   companyName?: string;
//   createdBy: mongoose.Types.ObjectId; // company admin
//   companyId: mongoose.Types.ObjectId; // company reference
//   createdAt: Date;
// }

// const LeadSchema = new Schema<ILead>(
//   {
//     name: {
//       type: String,
//       required: [true, "Lead name is required"],
//     },
//     email: {
//       type: String,
//       required: [true, "Lead email is required"],
//       lowercase: true,
//       trim: true,
//       match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
//     },
//     phone: {
//       type: String,
//       required: [true, "Lead phone number is required"],
//     },
//     address: {
//       type: String,
//       trim: true,
//     },
//     companyName: {
//       type: String,
//       trim: true,
//     },
//     createdBy: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     companyId: {
//       type: Schema.Types.ObjectId,
//       ref: "Company",
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model<ILead>("Lead", LeadSchema);



import mongoose, { Document, Schema } from "mongoose";

export interface ILead extends Document {
  name: string;
  email: string;
  phone: string;
  address?: string;
  companyName?: string; // only this
  createdBy: mongoose.Types.ObjectId; // company admin
  createdAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: [true, "Lead name is required"],
    },
    email: {
      type: String,
      required: [true, "Lead email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    phone: {
      type: String,
      required: [true, "Lead phone number is required"],
    },
    address: {
      type: String,
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model<ILead>("Lead", LeadSchema);
