import User from "../models/User";
import { createUser } from "../services/userService";

export const createDefaultSuperAdmin = async (): Promise<void> => {
  try {
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || "admin@example.com";
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || "Admin@123";

    const existingSuperAdmin = await User.findOne({
      email: superAdminEmail,
      role: "superadmin"
    });

    if (!existingSuperAdmin) {
      await createUser({
        name: "Super Admin",
        email: superAdminEmail,
        password: superAdminPassword,
        role: "superadmin"
      });
      console.log("Default Super Admin created successfully");
      console.log(`Email: ${superAdminEmail}`);
      console.log(`Password: ${superAdminPassword}`);
    } else {
      console.log("Super Admin already exists");
    }
  } catch (error: any) {
    console.error("Error creating default Super Admin:", error.message);
  }
};