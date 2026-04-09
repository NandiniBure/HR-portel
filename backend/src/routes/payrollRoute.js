// payrollRoute.js

import express from "express";
import {
  createPayroll,
  getPayroll,
} from "../controllers/payrollController.js";

const router = express.Router();

router.post("/create", createPayroll);
router.get("/:employee_id", getPayroll);

export default router;
