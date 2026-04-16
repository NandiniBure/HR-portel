import API from "@/middlewear/ClientApi"; // Use your interceptor-based axios instance

export default async function getAllLeaves(filters: any = {}) {
  try {
    const response = await API.get("/leaves/all", {
      params: filters,
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Failed to fetch leaves:",
      error?.response?.data?.message || error.message
    );
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "An error occurred while fetching leaves"
    );
  }
}
