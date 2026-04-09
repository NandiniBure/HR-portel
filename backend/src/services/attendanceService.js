import AttendanceModel from "../models/attendanceModel.js";

const AttendanceService = {
  async checkIn(employee_id) {
    const today = new Date().toISOString().split("T")[0];
    const now = new Date();

    const existingAttendance = await AttendanceModel.findByEmployeeAndDate(
      employee_id,
      today
    );

    if (existingAttendance) {
      throw new Error("Employee has already checked in today");
    }

    // The DB expects the check_in_time as a timestamp/date string
    const attendance = await AttendanceModel.createAttendance(
      employee_id,
      today,
      now.toISOString(), // ensure proper format for the DB
      "Present"
    );

    return attendance;
  },

  async checkOut(employee_id) {
    const today = new Date().toISOString().split("T")[0];
    const now = new Date();

    const existingAttendance = await AttendanceModel.findByEmployeeAndDate(
      employee_id,
      today
    );

    if (!existingAttendance) {
      throw new Error("Check-in not found for today");
    }

    if (existingAttendance.check_out_time) {
      throw new Error("Employee has already checked out today");
    }

    // The DB expects the check_out_time as a timestamp/date string
    const attendance = await AttendanceModel.updateCheckOut(
      existingAttendance.id,
      now.toISOString(), // ensure proper format for the DB
      existingAttendance.status || "Present"
    );

    return attendance;
  },

  async getAttendanceByEmployee(employee_id) {
    return await AttendanceModel.getAttendanceByEmployee(employee_id);
  },

  async getAllAttendance() {
    return await AttendanceModel.getAllAttendance();
  },

  async updateAttendanceStatus(id, status) {
    return await AttendanceModel.updateStatus(id, status);
  },

  async deleteAttendance(id) {
    return await AttendanceModel.deleteAttendance(id);
  },
};

export default AttendanceService;
