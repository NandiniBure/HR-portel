import {
    createDesignationService,
    getDesignationsService
  } from "../services/designationService.js";
  
  export const createDesignationController = async (req, res) => {
    try {
      const { title, level } = req.body;
  
      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }
  
      const data = await createDesignationService({ title, level });
  
      res.status(201).json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  export const getDesignationsController = async (req, res) => {
    try {
      const data = await getDesignationsService();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };