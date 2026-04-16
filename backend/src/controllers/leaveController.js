import {
  applyLeaveService,
  getMyLeavesService,
  getAllLeavesService,
  updateLeaveStatusService,
  deleteLeaveService,
  getLeaveBalancesService,
} from "../services/leaveService.js";

export const applyLeave = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const userId = req.user.id;

    const existingLeaves = await getMyLeavesService(userId);

    const newStart = new Date(startDate);
    const newEnd = endDate ? new Date(endDate) : newStart;

    const hasOverlappingLeave = existingLeaves.some((leave) => {
      if (!leave.startDate || !leave.endDate) return false;
      const leaveStart = new Date(leave.startDate);
      const leaveEnd = new Date(leave.endDate);
      return newStart <= leaveEnd && newEnd >= leaveStart;
    });

    if (hasOverlappingLeave) {
      return res.status(400).json({
        success: false,
        message:
          "You already have a leave applied that overlaps with this period.",
      });
    }

    const leave = await applyLeaveService({
      userId,
      startDate,
      endDate,
      ...req.body,
    });

    return res.status(201).json({
      success: true,
      message: "Leave applied successfully",
      data: leave,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await getMyLeavesService(req.user.id);

    return res.status(200).json({
      success: true,
      data: leaves,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllLeaves = async (req, res) => {
  try {
    const { fromDate, toDate, employeeName, status } = req.query;

    const leaves = await getAllLeavesService({
      fromDate,
      toDate,
      employeeName,
      status,
    });

    return res.status(200).json({
      success: true,
      data: leaves,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status, rejectionReason } = req.body;

    const updatedLeave = await updateLeaveStatusService(
      leaveId,
      status,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: `Leave status updated to ${status}`,
      data: updatedLeave,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteLeave = async (req, res) => {
  try {
    const { leaveId } = req.params;

    const deletedLeave = await deleteLeaveService(leaveId);

    return res.status(200).json({
      success: true,
      message: "Leave deleted successfully",
      data: deletedLeave,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getLeaveBalances = async (req, res) => {
  try {
    const { year } = req.query;
    console.log(year);
    if (!year) {
      return res.status(400).json({
        success: false,
        message: "Year parameter is required",
      });
    }

    const balances = await getLeaveBalancesService(req.user.id, year);

    return res.status(200).json({
      success: true,
      data: balances,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPendingLeaves = async (req, res) => {
  try {
    // Assumption: There is a service to get pending leaves
    // Filtering pending leaves (e.g., status === 'pending')
    const pendingLeaves = await getAllLeavesService({ status: "PENDING" });

    return res.status(200).json({
      success: true,
      data: pendingLeaves,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getEmployeesOnLeave = async (req, res) => {
  try {
    // Since today's date is 9, set todayStr to '2024-06-09'
    const todayStr = "2026-04-09";

    // Assuming getAllLeavesService can accept filters, and that leave dates are stored as start_date, end_date
    // Only approved leaves are considered
    const leavesOnToday = await getAllLeavesService({
      status: "APPROVED",
      overlapsDate: todayStr,
      includeEmployee: true, // Optionally enables join/fetching employee info
    });

    return res.status(200).json({
      success: true,
      data: leavesOnToday,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
