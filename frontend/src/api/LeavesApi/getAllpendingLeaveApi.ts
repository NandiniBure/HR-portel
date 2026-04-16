import API from "@/middlewear/ClientApi"; // Use your interceptor-based axios instance

export const getAllPendingLeaveApi = async () => {
  try {
    const response = await API.get("/leaves/pending-leaves");
    return response.data;
  } catch (error: any) {
    console.error(
      "Failed to fetch pending leaves:",
      error?.response?.data?.message || error.message
    );
    throw new Error(
      error?.response?.data?.message ||
      error.message ||
      "Network error"
    );
  }
};