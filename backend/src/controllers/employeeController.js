import {
  addEmployee,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
  fetchEmployeeById,
  searchEmployeeService,
  filterEmployeeService,
  getEmployeeByUserId,
} from "../services/emoloyeeService.js";

// ✅ CREATE EMPLOYEE (attach user_id)
const createEmployee = async (req, res) => {
  try {
    const userId = req.user.id; // 🔥 from JWT
    console.log(req.user.id);
    const employee = await addEmployee({
      ...req.body,
      user_id: userId,
    });

    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET ALL (now passes search to service if exists)
const getEmployees = async (req, res) => {
  try {
    const { search } = req.query;
    let employees;

    // Always pass search param to service, let service handle logic
    employees = await getAllEmployees(search && search.trim() !== "" ? search.trim() : undefined);

    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE (restrict: only own profile OR HR later)
const updateEmployeController = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await updateEmployee(id, req.body);

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE (same for now)
const deleteEmployeeController = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await deleteEmployee(id);

    res.json(deleted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔥 GET MY PROFILE (IMPORTANT CHANGE)
const getMyProfileController = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log(req);

    const employee = await getEmployeeByUserId(userId);

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ OLD get by id (keep for admin use)
const getEmployeeByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await fetchEmployeeById(id);

    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ SEARCH (no change)
const searchEmployeesController = async (req, res) => {
  try {
    const { q } = req.query;

    const results = await searchEmployeeService(q);

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔥 FILTER (fix boolean parsing)
const filterEmployeesController = async (req, res) => {
  try {
    const filters = {
      role: req.query.role,
      is_active:
        req.query.is_active !== undefined
          ? req.query.is_active === "true"
          : undefined,
    };

    const employees = await filterEmployeeService(filters);

    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  createEmployee,
  getEmployees,
  updateEmployeController,
  deleteEmployeeController,
  getEmployeeByIdController,
  getMyProfileController, // 🔥 NEW
  searchEmployeesController,
  filterEmployeesController,
};
