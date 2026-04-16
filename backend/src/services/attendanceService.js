import AttendanceModel from "../models/attendanceModel.js";

const AttendanceService = {
  async checkIn(employee_id) {
    const today = new Date().toISOString().split("T")[0];
    const now = new Date();

    const existingAttendance =
      await AttendanceModel.getAttendanceDetailsByEmployee(employee_id, today);

    console.log("---->", existingAttendance);

    if (existingAttendance) {
      throw new Error("Employee has already checked in today");
    }

    // The DB expects the check_in_time as a timestamp/date string
    const attendance = await AttendanceModel.createAttendance(
      employee_id,
      today,
      // Convert to Indian time (IST, UTC+5:30)
      new Date(now.getTime() + 5.5 * 60 * 60 * 1000).toISOString(),
      "Present"
    );

    return attendance;
  },

  async checkOut(employee_id) {
    const today = new Date().toISOString().split("T")[0];
    const now = new Date();

    const existingAttendance =
      await AttendanceModel.getAttendanceDetailsByEmployee(employee_id, today);

    if (!existingAttendance) {
      throw new Error("Check-in not found for today");
    }

    console.log("---->", existingAttendance[0]);
    if (existingAttendance.check_out_time) {
      throw new Error("Employee has already checked out today");
    }

    // The DB expects the check_out_time as a timestamp/date string
    const attendance = await AttendanceModel.updateCheckOut(
      existingAttendance.attendanceId,
      now.toISOString(), // ensure proper format for the DB
      existingAttendance.status || "Present"
    );

    return attendance;
  },

  async getAttendanceByEmployee(employee_id, date = null) {
    return await AttendanceModel.getAttendanceByEmployee(employee_id, date);
  },

  async getAllAttendance(date, search) {
    return await AttendanceModel.getAllAttendance(date, search);
  },
  async updateAttendanceStatus(id, status) {
    return await AttendanceModel.updateStatus(id, status);
  },

  async deleteAttendance(id) {
    return await AttendanceModel.deleteAttendance(id);
  },
};

export default AttendanceService;
