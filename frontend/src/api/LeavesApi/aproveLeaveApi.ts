import API from "@/middlewear/ClientApi"; // Use the axios instance with interceptors

export default async function updateLeaveStatus({ leaveId, status }) {
  try {
    const response = await API.patch(
      `/leaves/${leaveId}/status`,
      { status }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Failed to update leave status:",
      error?.response?.data?.message || error.message
    );
    throw new Error(
      error?.response?.data?.message ||
      error.message ||
      "An error occurred while updating leave status"
    );
  }
}
