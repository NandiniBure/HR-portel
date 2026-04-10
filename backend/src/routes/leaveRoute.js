import express from "express";
import {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
  deleteLeave,
  getLeaveBalances,
  getPendingLeaves,
  getEmployeesOnLeave,
} from "../controllers/leaveController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/leaves", authenticate, applyLeave);
router.get("/leaves/me", authenticate, getMyLeaves);
router.get("/leaves/all", authenticate, getAllLeaves);
router.patch(
  "/leaves/:leaveId/status",
  authenticate,
  authorizeRoles("manager"),
  updateLeaveStatus
);
router.delete("/leaves/:leaveId", authenticate, deleteLeave);
router.get("/leaves/balance", authenticate, getLeaveBalances);
router.get(
  "/leaves/pending-leaves",
  authenticate,
  getPendingLeaves
);
router.get(
  "/leaves/employees-onleave-today",
  authenticate,
  getEmployeesOnLeave
);
export default router;
