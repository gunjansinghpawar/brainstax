import Company, { ICompany, IDepartment } from "../models/Company";
import User, { IUser } from "../models/User";
import Employee, { IEmployee } from "../models/Employee";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

interface CreateCompanyData {
  name: string;
  email: string;
  address: string;
  phone: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
  departments?: IDepartment[];
}

export const createCompany = async (
  data: CreateCompanyData
): Promise<{ company: ICompany; companyAdmin: IUser }> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if company email already exists
    const existingCompany = await Company.findOne({ email: data.email });
    if (existingCompany) {
      throw new Error("Company with this email already exists");
    }

    // Check if admin email already exists
    const existingAdmin = await User.findOne({ email: data.adminEmail });
    if (existingAdmin) {
      throw new Error("Admin with this email already exists");
    }

    // Hash admin password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.adminPassword, salt);

    // Create company admin user
    const companyAdmin = await User.create(
      [
        {
          name: data.adminName,
          email: data.adminEmail,
          password: hashedPassword,
          role: "companyadmin",
          isFirstLogin: true,
          companies: []
        }
      ],
      { session }
    );

    // Create company with default departments
    const company = await Company.create(
      [
        {
          name: data.name,
          email: data.email,
          address: data.address,
          phone: data.phone,
          companyAdmin: companyAdmin[0]._id,
          employees: [],
          departments: data.departments || [
            { name: "HR", description: "Human Resources" },
            { name: "IT", description: "Information Technology" },
            { name: "Finance", description: "Finance and Accounting" },
            { name: "Operations", description: "Operations Management" }
          ]
        }
      ],
      { session }
    );

    // Update company admin with company reference
    await User.findByIdAndUpdate(
      companyAdmin[0]._id,
      { $push: { companies: company[0]._id } },
      { session }
    );

    await session.commitTransaction();

    return {
      company: company[0],
      companyAdmin: companyAdmin[0]
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getCompanies = async (): Promise<ICompany[]> => {
  return await Company.find()
    .populate("companyAdmin", "-password")
    .populate({
      path: "employees",
      populate: {
        path: "userId",
        select: "-password"
      }
    })
    .exec();
};

export const getCompanyById = async (id: string): Promise<ICompany | null> => {
  return await Company.findById(id)
    .populate("companyAdmin", "-password")
    .populate({
      path: "employees",
      populate: {
        path: "userId",
        select: "-password"
      }
    })
    .exec();
};

export const updateCompany = async (
  id: string,
  data: Partial<CreateCompanyData>
): Promise<ICompany | null> => {
  const updateData: any = {};
  
  if (data.name) updateData.name = data.name;
  if (data.email) updateData.email = data.email;
  if (data.address) updateData.address = data.address;
  if (data.phone) updateData.phone = data.phone;
  if (data.departments) updateData.departments = data.departments;

  return await Company.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  })
    .populate("companyAdmin", "-password")
    .populate({
      path: "employees",
      populate: {
        path: "userId",
        select: "-password"
      }
    })
    .exec();
};

export const deleteCompany = async (id: string): Promise<ICompany | null> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const company = await Company.findById(id);
    if (!company) {
      throw new Error("Company not found");
    }

    // Get all employee records
    const employees = await Employee.find({ companyId: id });
    const userIds = employees.map(emp => emp.userId);

    // Delete all employee records
    await Employee.deleteMany({ companyId: id }, { session });

    // Delete company admin
    await User.findByIdAndDelete(company.companyAdmin, { session });

    // Delete all employee users
    await User.deleteMany({ _id: { $in: userIds } }, { session });

    // Delete company
    const deletedCompany = await Company.findByIdAndDelete(id, { session });

    await session.commitTransaction();
    return deletedCompany;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const addEmployeeToCompany = async (
  companyId: string,
  employeeData: {
    name: string;
    email: string;
    password: string;
    department: string;
  }
): Promise<{ user: IUser; employee: IEmployee }> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const company = await Company.findById(companyId);
    if (!company) {
      throw new Error("Company not found");
    }

    // Check if department exists in company
    const departmentExists = company.departments.some(
      dept => dept.name.toLowerCase() === employeeData.department.toLowerCase()
    );
    if (!departmentExists) {
      throw new Error(`Department '${employeeData.department}' does not exist in this company`);
    }

    // Check if employee email already exists
    const existingUser = await User.findOne({ email: employeeData.email });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(employeeData.password, salt);

    // Create user
    const user = await User.create(
      [
        {
          name: employeeData.name,
          email: employeeData.email,
          password: hashedPassword,
          role: "employee",
          isFirstLogin: true,
          companies: [companyId]
        }
      ],
      { session }
    );

    // Create employee record
    const employee = await Employee.create(
      [
        {
          userId: user[0]._id,
          companyId: companyId,
          name: employeeData.name,
          department: employeeData.department
        }
      ],
      { session }
    );

    // Add employee to company
    await Company.findByIdAndUpdate(
      companyId,
      { $push: { employees: employee[0]._id } },
      { session }
    );

    await session.commitTransaction();
    
    return {
      user: user[0],
      employee: employee[0]
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const removeEmployeeFromCompany = async (
  companyId: string,
  employeeId: string
): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find employee record
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new Error("Employee not found");
    }

    // Remove employee from company
    await Company.findByIdAndUpdate(
      companyId,
      { $pull: { employees: employeeId } },
      { session }
    );

    // Delete employee record
    await Employee.findByIdAndDelete(employeeId, { session });

    // Delete user
    await User.findByIdAndDelete(employee.userId, { session });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getEmployeesByCompany = async (companyId: string): Promise<IEmployee[]> => {
  return await Employee.find({ companyId })
    .populate("userId", "-password")
    .populate("companyId", "name email")
    .exec();
};

export const getEmployeeById = async (employeeId: string): Promise<IEmployee | null> => {
  return await Employee.findById(employeeId)
    .populate("userId", "-password")
    .populate("companyId", "name email")
    .exec();
};