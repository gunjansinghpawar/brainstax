

import Lead, { ILead } from "../models/Leads";

export const createLead = async (data: Partial<ILead>) => {
  return Lead.create(data);
};

export const getLeadsByUser = async (userId: string) => {
  return Lead.find({ createdBy: userId });
};

export const updateLead = async (
  leadId: string,
  updateData: Partial<ILead>,
  userId: string
) => {
  const lead = await Lead.findOneAndUpdate(
    { _id: leadId, createdBy: userId }, // only owner can update
    updateData,
    { new: true }
  );

  if (!lead) throw new Error("Lead not found or not authorized");

  return lead;
};

export const deleteLead = async (leadId: string, userId: string) => {
  const lead = await Lead.findOneAndDelete({
    _id: leadId,
    createdBy: userId,
  });

  if (!lead) throw new Error("Lead not found or unauthorized");

  return lead;
};
