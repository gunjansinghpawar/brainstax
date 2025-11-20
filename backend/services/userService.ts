import User, { IUser, Role } from "../models/User";
import bcrypt from "bcryptjs";

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

export const createUser = async (data: CreateUserData): Promise<IUser> => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);

  // Create user
  const user = await User.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: data.role || "employee",
    isFirstLogin: true
  });

  return user;
};

export const getUsers = async (): Promise<IUser[]> => {
  return await User.find().select("-password").exec();
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  return await User.findById(id).select("-password").exec();
};

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  return await User.findOne({ email }).exec();
};

export const updateUser = async (
  id: string,
  data: Partial<CreateUserData>
): Promise<IUser | null> => {
  if (data.password) {
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);
  }

  return await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  })
    .select("-password")
    .exec();
};

export const deleteUser = async (id: string): Promise<IUser | null> => {
  return await User.findByIdAndDelete(id).select("-password").exec();
};

export const updateFirstLogin = async (id: string): Promise<void> => {
  await User.findByIdAndUpdate(id, { isFirstLogin: false });
};

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

