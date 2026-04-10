import {
    getDepartments,
    getDesignations,
  } from "../models/masterModel.js";
  
  export const getDepartmentsService = async () => {
    return await getDepartments();
  };
  
  export const getDesignationsService = async () => {
    return await getDesignations();
  };