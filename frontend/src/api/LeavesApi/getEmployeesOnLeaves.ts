import axios from "axios";

// Fetches employees who are on leave today
export const getEmployeesOnLeaveToday = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:5000/api/leaves/employees-onleave-today", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    // Standardize error for frontend use
    throw error.response?.data || error.message || "Failed to fetch employees on leave today";
  }
};