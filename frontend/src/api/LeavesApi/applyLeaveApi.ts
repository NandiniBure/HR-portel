import axios from "axios";


export default async function applyLeave({
  leaveTypeId,
  startDate,
  endDate,
  startSession,
  endSession,
  totalDays,
  reason,
}) {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      "http://localhost:5000/api/leaves",
      {
        leaveTypeId,
        startDate,
        endDate,
        startSession,
        endSession,
        totalDays,
        reason,
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
    console.error("Apply leave failed:", error.response?.data || error.message);
    throw error;
  }
}
