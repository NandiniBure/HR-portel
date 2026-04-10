import express from "express";
import {
  createDepartmentController,
  getDepartmentsController,
} from "../controllers/departmentController.js";

const router = express.Router();

router.post("/", createDepartmentController);
router.get("/", getDepartmentsController);

export default router;
