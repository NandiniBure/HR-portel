import API from "@/middlewear/ClientApi"; // Use your interceptor-based axios instance

export default async function getEmployeeById() {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      throw new Error("No userId found in localStorage");
    }
    const response = await API.get(`/employees/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error(
      "Failed to fetch employee details:",
      error?.response?.data?.message || error.message
    );
    throw new Error(
      error?.response?.data?.message ||
      error.message ||
      "An error occurred while fetching employee details"
    );
  }
}
