import * as DepartmentModel from "../models/departmentModel.js";

export const createDepartmentService = async (data) => {
  return await DepartmentModel.createDepartment(
    data.name,
    data.description
  );
};

export const getDepartmentsService = async () => {
  return await DepartmentModel.getDepartments();
};