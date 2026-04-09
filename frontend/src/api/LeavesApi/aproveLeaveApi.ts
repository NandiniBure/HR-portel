import axios from "axios";

export default async function updateLeaveStatus({ leaveId, status }) {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.patch(
      `http://localhost:5000/api/leaves/${leaveId}/status`,
      {
        status,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Failed to update leave status:",
      error.response?.data || error.message
    );
    throw error;
  }
}
