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
    const leave = await applyLeaveService({
      userId: req.user.id,
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
    const leaves = await getAllLeavesService();

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
      req.user.id,
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
    console.log(year)
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
    const pendingLeaves = await getAllLeavesService({ status: 'PENDING' });

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