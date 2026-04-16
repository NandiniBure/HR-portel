import API from "@/middlewear/ClientApi"; // Use the axios instance with interceptors

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
    const response = await API.post("/leaves", {
      leaveTypeId,
      startDate,
      endDate,
      startSession,
      endSession,
      totalDays,
      reason,
    });

    return response.data;
  } catch (error) {
    console.error("Apply leave failed:", error?.response?.data || error.message);
    throw new Error(
      error?.response?.data?.message ||
      error.message ||
      "An error occurred while applying for leave"
    );
  }
}
