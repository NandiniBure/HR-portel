import db from "../config/db.js";

export const createPayroll = async (dataToSave) => {
  if (
    !Array.isArray(dataToSave) ||
    dataToSave.length !== 6 ||
    dataToSave[0] === undefined ||
    dataToSave[1] === undefined ||
    dataToSave[2] === undefined
  ) {
    throw new Error(
      "Missing required payroll fields: employee_id, month, basic_salary"
    );
  }

  try {
    // Try inserting all fields first
    const result = await db.query(
      `INSERT INTO payroll (
        employee_id,
        month,
        basic_salary,
        bonus,
        deductions,
        net_salary
      ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      dataToSave
    );
    return result.rows[0];
  } catch (err) {
    if (
      err.message &&
      err.message.includes(
        'cannot insert a non-DEFAULT value into column "net_salary"'
      )
    ) {
      const [employee_id, month, basic_salary, bonus, deductions] = dataToSave;
      const result = await db.query(
        `INSERT INTO payroll (
          employee_id,
          month,
          basic_salary,
          bonus,
          deductions
        ) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [employee_id, month, basic_salary, bonus, deductions]
      );
      return result.rows[0];
    }
    // Otherwise, rethrow the error
    throw err;
  }
};

export const getPayrollByEmployee = async (employee_id) => {
  const result = await db.query(
    `SELECT 
      id AS "id",
      employee_id AS "employeeId",
      month AS "month",
      basic_salary AS "basicSalary",
      bonus AS "bonus",
      deductions AS "deductions",
      net_salary AS "netSalary"
    FROM payroll
    WHERE employee_id = $1`,
    [employee_id]
  );
  return result.rows;
};
export const getPayrolls = async () => {
  const { rows } = await db.query(`
    SELECT 
      p.id AS "id",
      p.employee_id AS "employeeId",
      p.month AS "month",
      p.basic_salary AS "basicSalary",
      p.bonus AS "bonus",
      p.deductions AS "deductions",
      p.net_salary AS "netSalary",

      e.first_name AS "firstName",
      e.last_name AS "lastName",
      e.salary AS "salary",
      e.phone AS "phone",
      e.department_id AS "departmentId",
      e.designation_id AS "designationId"
    FROM payroll p
    JOIN employees e 
      ON p.employee_id = e.id
  `);

  const summary = await db.query(`
    SELECT 
      SUM(net_salary) AS "totalPayroll",
      AVG(net_salary) AS "avgPayroll"
    FROM payroll
  `);

  return {
    payrolls: rows,
    summary: summary.rows[0],
  };
};
