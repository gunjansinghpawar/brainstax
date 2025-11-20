

import { Request, Response } from "express";
import * as leadService from "../services/leadService";
import { AuthRequest } from "../middleware/auth";
import mongoose from "mongoose";


export const createLead = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { name, email, phone, address, companyName } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and phone are required",
      });
    }

    const lead = await leadService.createLead({
      name,
      email,
      phone,
      address,
      companyName,
      createdBy: new mongoose.Types.ObjectId(req.user.id),
    });

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getCompanyLeads = async (req: AuthRequest, res: Response) => {
  try {
    const leads = await leadService.getLeadsByUser(req.user!.id);

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const updateLead = async (req: AuthRequest, res: Response) => {
  try {
    const updatedLead = await leadService.updateLead(
      req.params.id,
      req.body,
      req.user!.id
    );

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: updatedLead,
    });

  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};


export const deleteLead = async (req: AuthRequest, res: Response) => {
  try {
    await leadService.deleteLead(req.params.id, req.user!.id);

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });

  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
