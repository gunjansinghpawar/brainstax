


import express from "express";
import { auth, authorizeRoles } from "../middleware/auth";
import {
  createLead,
  getCompanyLeads,
  updateLead,
  deleteLead
} from "../controllers/leadController";

const router = express.Router();

router.post("/create", auth, authorizeRoles("companyadmin"), createLead);
router.get("/", auth, authorizeRoles("companyadmin"), getCompanyLeads);
router.put("/:id", auth, authorizeRoles("companyadmin"), updateLead);
router.delete("/:id", auth, authorizeRoles("companyadmin"), deleteLead);

export default router;
