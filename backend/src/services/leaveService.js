import {
  getEmployeeByUserId,
  createLeave,
  fetchMyLeaves,
  fetchAllLeaves,
  updateLeaveStatusDB,
  deleteLeaveDB,
  fetchLeaveBalances,
  insertLeaveApprovalHistory,
} from "../models/leaveModel.js";

export const applyLeaveService = async ({
  userId,
  leaveTypeId,
  startDate,
  endDate,
  startSession,
  endSession,
  totalDays,
  reason,
}) => {
  const employee = await getEmployeeByUserId(userId);
  if (!employee) {
    throw new Error("Employee not found");
  }

  const leave = await createLeave({
    employeeId: employee.employeeId,
    leaveTypeId,
    startDate,
    endDate,
    startSession,
    endSession,
    totalDays,
    reason,
  });

  // Insert leave application into approval history (optional)
  // await insertLeaveApprovalHistory({
  //   leaveId: leave.leaveId,
  //   action: "APPLIED",
  //   actedBy: employee.employeeId,
  //   comment: reason || "Leave applied",
  // });

  return leave;
};

export const getMyLeavesService = async (userId) => {
  return await fetchMyLeaves(userId);
};

export const getAllLeavesService = async (options = {}) => {
  // Pass status for fetching pending leaves if provided in options
  return await fetchAllLeaves(options.status ? { status: options.status } : undefined);
};

export const updateLeaveStatusService = async (
  leaveId,
  status,
  approvedByUserId,
  rejectionReason
) => {
  console.log(approvedByUserId);
  const approver = await getEmployeeByUserId(approvedByUserId);

  if (!approver) {
    throw new Error("Approver not found");
  }

  const updatedLeave = await updateLeaveStatusDB({
    leaveId,
    status,
    approvedBy: approver.employeeId,
    rejectionReason,
  });

  if (!updatedLeave) {
    throw new Error("Leave not found");
  }

  // await insertLeaveApprovalHistory({
  //   leaveId,
  //   action: status,
  //   actedBy: approver.employeeId,
  //   comment:
  //     status === "REJECTED"
  //       ? rejectionReason || "Leave rejected"
  //       : "Leave approved",
  // });

  return updatedLeave;
};

export const deleteLeaveService = async (leaveId) => {
  const deletedLeave = await deleteLeaveDB(leaveId);

  if (!deletedLeave) {
    throw new Error("Leave not found");
  }

  return deletedLeave;
};

export const getLeaveBalancesService = async (userId, year) => {
  console.log(userId);
  const employee = await getEmployeeByUserId(userId);

  if (!employee) {
    throw new Error("Employee not found");
  }

  console.log(employee);

  return await fetchLeaveBalances(employee.employeeId, year);
};
