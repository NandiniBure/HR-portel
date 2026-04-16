import AttendanceService from "../services/attendanceService.js";

// Export each controller function directly as a named export

export async function checkIn(req, res) {
  try {
    const { employee_id } = req.body;
    console.log(employee_id);
    if (!employee_id) {
      return res.status(400).json({
        success: false,
        message: "employee_id is required",
      });
    }

    const attendance = await AttendanceService.checkIn(employee_id);

    return res.status(200).json({
      success: true,
      message: "Check-in successful",
      data: attendance,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function checkOut(req, res) {
  try {
    const { employee_id } = req.body;

    if (!employee_id) {
      return res.status(400).json({
        success: false,
        message: "employee_id is required",
      });
    }

    const attendance = await AttendanceService.checkOut(employee_id);

    return res.status(200).json({
      success: true,
      message: "Check-out successful",
      data: attendance,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getAttendanceByEmployee(req, res) {
  try {
    // Get employeeId from params and date from query (date is optional)
    const { employeeId } = req.params;
    const date = req.query.date || null;

    const attendance = await AttendanceService.getAttendanceByEmployee(
      employeeId,
      date // If date is not provided, service should use default (today)
    );

    return res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getAllAttendance(req, res) {
  try {
    const { date, search } = req.query;

    const attendance = await AttendanceService.getAllAttendance(date, search);

    return res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function updateAttendanceStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "status is required",
      });
    }

    const updatedAttendance = await AttendanceService.updateAttendanceStatus(
      id,
      status
    );

    return res.status(200).json({
      success: true,
      message: "Attendance status updated successfully",
      data: updatedAttendance,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function deleteAttendance(req, res) {
  try {
    const { id } = req.params;

    const deletedAttendance = await AttendanceService.deleteAttendance(id);

    return res.status(200).json({
      success: true,
      message: "Attendance deleted successfully",
      data: deletedAttendance,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
