import express from "express";
import {
  createDesignationController,
  getDesignationsController,
} from "../controllers/designationController.js";

const router = express.Router();

router.post("/", createDesignationController);
router.get("/", getDesignationsController);

export default router;
