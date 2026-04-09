import express from "express";
import {
  getDepartmentsController,
  getDesignationsController,
} from "../controllers/masterController.js";

const router = express.Router();

router.get("/departments", getDepartmentsController);
router.get("/designations", getDesignationsController);

export default router;
