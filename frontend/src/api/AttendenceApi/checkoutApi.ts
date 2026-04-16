import API from "@/middlewear/ClientApi"; // Use the axios instance with interceptors

export const checkOutAttendance = async ({ employeeId }) => {
  try {
    if (!employeeId) {
      throw new Error("employeeId is required for check-out");
    }

    const response = await API.post("/attendance/check-out", {
      employee_id: employeeId,
    });

    return response.data;
  } catch (error) {
    console.error(
      "Check-out failed:",
      error?.response?.data?.message || error.message
    );
    throw new Error(
      error?.response?.data?.message ||
      error.message ||
      "An error occurred during attendance check-out"
    );
  }
};