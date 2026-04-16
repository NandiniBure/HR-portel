import API from "@/middlewear/ClientApi"; // Use your interceptor-based axios instance

// Fetches employees who are on leave today
export const getEmployeesOnLeaveToday = async () => {
  try {
    const response = await API.get("/leaves/employees-onleave-today");
    return response.data;
  } catch (error: any) {
    console.error(
      "Failed to fetch employees on leave today:",
      error?.response?.data?.message || error.message
    );
    throw new Error(
      error?.response?.data?.message ||
      error.message ||
      "Failed to fetch employees on leave today"
    );
  }
};