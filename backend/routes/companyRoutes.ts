import { Router } from "express";
import * as companyController from "../controllers/companyController";

const router = Router();

// GET /api/companies - Get all companies
router.get("/", companyController.getCompanies);

// GET /api/companies/:id - Get company by ID
router.get("/:id", companyController.getCompanyById);

// POST /api/companies - Create new company (Super Admin only)
router.post("/", companyController.createCompany);

// PUT /api/companies/:id - Update company
router.put("/:id", companyController.updateCompany);

// DELETE /api/companies/:id - Delete company
router.delete("/:id", companyController.deleteCompany);

// GET /api/companies/:id/employees - Get all employees of a company
router.get("/:id/employees", companyController.getEmployees);

// GET /api/companies/:id/employees/:employeeId - Get employee by ID
router.get("/:id/employees/:employeeId", companyController.getEmployeeById);

// POST /api/companies/:id/employees - Add employee to company (Company Admin only)
router.post("/:id/employees", companyController.addEmployee);

// DELETE /api/companies/:id/employees/:employeeId - Remove employee from company
router.delete("/:id/employees/:employeeId", companyController.removeEmployee);

export default router;