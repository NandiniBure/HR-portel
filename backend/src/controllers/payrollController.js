// payrollController.js

import * as payrollModel from "../models/payrollModel.js";
// Removed: import payrollService from '../services/payrollService.js';

export const createPayroll = async (req, res) => {
  try {
    const {
      employee_id,
      month,
      basic_salary,
      bonus = 0,
      deductions = 0,
    } = req.body;

    if (!employee_id || !month || basic_salary === undefined) {
      return res.status(400).json({
        success: false,
        message: "employee_id, month and basic_salary are required",
      });
    }

    // Calculate net_salary
    const net_salary =
      Number(basic_salary) + Number(bonus) - Number(deductions);

    const dataToSave = [
      employee_id,
      month,
      basic_salary,
      bonus,
      deductions,
      net_salary,
    ];

    console.log(dataToSave);

    const result = await payrollModel.createPayroll(dataToSave);

    res.status(201).json({
      success: true,
      message: "Payroll generated",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getPayroll = async (req, res) => {
  try {
    const { employee_id } = req.params;

    if (!employee_id) {
      return res.status(400).json({
        success: false,
        message: "employee_id param is required",
      });
    }

    const data = await payrollModel.getPayrollByEmployee(employee_id);

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
