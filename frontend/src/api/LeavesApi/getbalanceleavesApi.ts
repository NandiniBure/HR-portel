import API from "@/middlewear/ClientApi"; // Use your interceptor-based axios instance

export default async function getLeaveBalance(year: string | number) {
  try {
    const response = await API.get(`/leaves/balance`, {
      params: { year },
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Get leave balance failed:",
      error?.response?.data?.message || error.message
    );
    throw new Error(
      error?.response?.data?.message ||
      error.message ||
      "An error occurred while fetching leave balance"
    );
  }
}
