// payrollService.js

const payrollModel = require("../models/payrollModel");
const executeQuery = require("../config/db");

const generatePayroll = async (
  employee_id,
  month,
  bonus = 0,
  deductions = 0
) => {
  // 1. Get salary
  const emp = await executeQuery(`
    SELECT salary AS "salary"
    FROM employees
    WHERE id = ${employee_id}
  `);

  if (!emp.length) throw new Error("Employee not found");

  const basicSalary = emp[0].salary;

  // 2. Attendance
  const attendance = await executeQuery(`
    SELECT COUNT(*) AS "present_days"
    FROM attendance
    WHERE employee_id = ${employee_id}
    AND status = 'Present'
    AND TO_CHAR(date, 'YYYY-MM') = '${month}'
  `);

  const presentDays = attendance[0].present_days;

  const perDay = basicSalary / 30;
  const earned = perDay * presentDays;

  const netSalary = earned + bonus - deductions;

  // 3. Save
  await payrollModel.createPayroll({
    employee_id,
    month,
    basic_salary: basicSalary,
    bonus,
    deductions,
    net_salary: netSalary,
  });

  return {
    basicSalary,
    presentDays,
    netSalary,
  };
};

module.exports = {
  generatePayroll,
};
