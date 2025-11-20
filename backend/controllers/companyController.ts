// import { Request, Response } from "express";
// import * as companyService from "../services/companyService";

// // Get all companies
// export const getCompanies = async (_req: Request, res: Response) => {
//   try {
//     const companies = await companyService.getCompanies();
//     return res.status(200).json({
//       success: true,
//       count: companies.length,
//       data: companies
//     });
//   } catch (error: any) {
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Internal server error"
//     });
//   }
// };

// // Get company by ID
// export const getCompanyById = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const company = await companyService.getCompanyById(id);

//     if (!company) {
//       return res.status(404).json({
//         success: false,
//         message: "Company not found"
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       data: company
//     });
//   } catch (error: any) {
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Internal server error"
//     });
//   }
// };

// // Create company (Super Admin only)
// export const createCompany = async (req: Request, res: Response) => {
//   try {
//     const {
//       name,
//       email,
//       address,
//       phone,
//       adminName,
//       adminEmail,
//       adminPassword,
//       departments
//     } = req.body;

//     // Validation
//     if (!name || !email || !address || !phone || !adminName || !adminEmail || !adminPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required: name, email, address, phone, adminName, adminEmail, adminPassword"
//       });
//     }

//     const result = await companyService.createCompany({
//       name,
//       email,
//       address,
//       phone,
//       adminName,
//       adminEmail,
//       adminPassword,
//       departments
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Company and company admin created successfully",
//       data: {
//         company: result.company,
//         companyAdmin: result.companyAdmin
//       }
//     });
//   } catch (error: any) {
//     return res.status(400).json({
//       success: false,
//       message: error.message || "Bad request"
//     });
//   }
// };

// // Update company
// export const updateCompany = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     const company = await companyService.updateCompany(id, updateData);

//     if (!company) {
//       return res.status(404).json({
//         success: false,
//         message: "Company not found"
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Company updated successfully",
//       data: company
//     });
//   } catch (error: any) {
//     return res.status(400).json({
//       success: false,
//       message: error.message || "Bad request"
//     });
//   }
// };

// // Delete company
// export const deleteCompany = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const company = await companyService.deleteCompany(id);

//     if (!company) {
//       return res.status(404).json({
//         success: false,
//         message: "Company not found"
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Company, company admin, and all employees deleted successfully",
//       data: company
//     });
//   } catch (error: any) {
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Internal server error"
//     });
//   }
// };

// // Add employee to company (Company Admin)
// export const addEmployee = async (req: Request, res: Response) => {
//   try {
//     const { id: companyId } = req.params;
//     const { name, email, password } = req.body;

//     // Validation
//     if (!name || !email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Name, email, and password are required"
//       });
//     }

//     const employee = await companyService.addEmployeeToCompany(companyId, {
//       name,
//       email,
//       password
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Employee added successfully",
//       data: employee
//     });
//   } catch (error: any) {
//     return res.status(400).json({
//       success: false,
//       message: error.message || "Bad request"
//     });
//   }
// };

// // Remove employee from company
// export const removeEmployee = async (req: Request, res: Response) => {
//   try {
//     const { id: companyId, employeeId } = req.params;

//     await companyService.removeEmployeeFromCompany(companyId, employeeId);

//     return res.status(200).json({
//       success: true,
//       message: "Employee removed successfully"
//     });
//   } catch (error: any) {
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Internal server error"
//     });
//   }
// };

import { Request, Response } from "express";
import * as companyService from "../services/companyService";

// Get all companies
export const getCompanies = async (_req: Request, res: Response) => {
  try {
    const companies = await companyService.getCompanies();
    return res.status(200).json({
      success: true,
      count: companies.length,
      data: companies
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

// Get company by ID
export const getCompanyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const company = await companyService.getCompanyById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: company
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

// Create company (Super Admin only)
export const createCompany = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      address,
      phone,
      adminName,
      adminEmail,
      adminPassword,
      departments
    } = req.body;

    // Validation
    if (!name || !email || !address || !phone || !adminName || !adminEmail || !adminPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: name, email, address, phone, adminName, adminEmail, adminPassword"
      });
    }

    const result = await companyService.createCompany({
      name,
      email,
      address,
      phone,
      adminName,
      adminEmail,
      adminPassword,
      departments
    });
    
    return res.status(201).json({
      success: true,
      message: "Company and company admin created successfully",
      data: {
        company: result.company,
        companyAdmin: result.companyAdmin
      }
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Bad request"
    });
  }
};

// Update company
export const updateCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const company = await companyService.updateCompany(id, updateData);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Company updated successfully",
      data: company
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Bad request"
    });
  }
};

// Delete company
export const deleteCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const company = await companyService.deleteCompany(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Company, company admin, and all employees deleted successfully",
      data: company
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

// Add employee to company (Company Admin only)
export const addEmployee = async (req: Request, res: Response) => {
  try {
    const { id: companyId } = req.params;
    const {user, department } = req.body;
    console.log("Data",req.body)
      // Validation
    if (!user.name || !user.email || !user.password || !department) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password, and department are required"
      });
    }

    const result = await companyService.addEmployeeToCompany(companyId, {
      name: user.name,
      email: user.email,
      password: user.password,
      department
    });

    return res.status(201).json({
      success: true,
      message: "Employee added successfully",
      data: {
        user: result.user,
        employee: result.employee
      }
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Bad request"
    });
  }
};

// Remove employee from company
export const removeEmployee = async (req: Request, res: Response) => {
  try {
    const { id: companyId, employeeId } = req.params;

    await companyService.removeEmployeeFromCompany(companyId, employeeId);

    return res.status(200).json({
      success: true,
      message: "Employee removed successfully"
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

// Get all employees of a company
export const getEmployees = async (req: Request, res: Response) => {
  try {
    const { id: companyId } = req.params;
    const employees = await companyService.getEmployeesByCompany(companyId);

    return res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

// Get employee by ID
export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params;
    const employee = await companyService.getEmployeeById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};