import {
  createEmployee,
  deleteEmployeeById,
  getEmployeeById,
  getEmployees,
  updateEmployeeById,
  searchEmployees,
  filterEmployees,
  getEmployeeByUserIdModel
} from "../models/employeeModel.js";

const addEmployee = async (data) => {
  return await createEmployee(data);
};

const getAllEmployees = async (search) => {
  return await getEmployees(search);
};

const updateEmployee = async (id, data) => {
  return await updateEmployeeById(id, data);
};

const deleteEmployee = async (id) => {
  return await deleteEmployeeById(id);
};

const fetchEmployeeById = async (id) => {
  return await getEmployeeById(id);
};

const searchEmployeeService = async (query) => {
  return await searchEmployees(query);
};

const filterEmployeeService = async (filters) => {
  return await filterEmployees(filters);
};

const getEmployeeByUserId = async (userId) => {
  return await getEmployeeByUserIdModel(userId);
};

export {
  addEmployee,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
  fetchEmployeeById,
  searchEmployeeService,
  filterEmployeeService,
  getEmployeeByUserId
};
