import express from "express";
import {
  checkIn,
  checkOut,
  getAllAttendance,
  getAttendanceByEmployee,
  updateAttendanceStatus,
  deleteAttendance,
} from "../controllers/attendanceController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Check in
router.post("/attendance/check-in", authenticate, checkIn);

// Check out
router.post("/attendance/check-out", authenticate, checkOut);

// Get all attendance
router.get("/attendance", authenticate, getAllAttendance);

// Get attendance by employee
router.get("/attendance/employee/:employeeId", authenticate, getAttendanceByEmployee);

// Update attendance status
router.put("/attendance/:id/status", authenticate, updateAttendanceStatus);

// Delete attendance
router.delete("/attendance/:id", authenticate, deleteAttendance);

export default router;
