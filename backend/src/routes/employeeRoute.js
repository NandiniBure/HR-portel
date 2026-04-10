import express from "express";

import {
  createEmployee,
  deleteEmployeeController,
  filterEmployeesController,
  getEmployeeByIdController,
  getEmployees,
  getMyProfileController,
  searchEmployeesController,
  updateEmployeController,
} from "../controllers/employeeController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/employees", authenticate, authorizeRoles("manager"), createEmployee);
router.get("/employees", authenticate, getEmployees);
router.patch(
  "/employees/:id",
  authenticate,
  authorizeRoles("manager"),
  updateEmployeController
);
router.delete("/employees/:id", authenticate, deleteEmployeeController);
router.get("/employees/search", authenticate, searchEmployeesController);
router.get("/employees/filter", authenticate, filterEmployeesController);
router.get("/employees/:id", authenticate, getEmployeeByIdController);
router.get("/me", authenticate, getMyProfileController);

export default router;
