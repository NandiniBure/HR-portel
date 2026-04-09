import {
  createDepartmentService,
  getDepartmentsService,
} from "../services/departmentService.js";

export const createDepartmentController = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const data = await createDepartmentService({ name, description });

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDepartmentsController = async (req, res) => {
  try {
    const data = await getDepartmentsService();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
