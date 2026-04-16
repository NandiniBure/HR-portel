// payrollRoute.js

import express from "express";
import {
  createPayroll,
  getPayroll,
  getAllPayroll,
} from "../controllers/payrollController.js";

const router = express.Router();

// Route to create a new payroll entry
router.post("/create", createPayroll);

// Route to get payroll details of a specific employee
router.get("/:employee_id", getPayroll);

// Route to get all payroll records
router.get("/all/payrolls", getAllPayroll);

export default router;
