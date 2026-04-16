import API from "@/middlewear/ClientApi"; // Use the axios instance with interceptors

export const getEmployeeAttendance = async (employeeId: string, date?: string) => {
  try {
    if (!employeeId) {
      throw new Error("employeeId is required to get attendance");
    }

    const params: Record<string, string> = {};
    if (date) {
      params.date = date;
    }

    const response = await API.get(`/attendance/employee/${employeeId}`, {
      params: Object.keys(params).length > 0 ? params : undefined,
    });

    return response.data;
  } catch (error: any) {
    console.error("Error fetching attendance:", error?.response?.data?.message || error.message);
    throw new Error(
      error?.response?.data?.message ||
      error.message ||
      "Something went wrong while fetching attendance"
    );
  }
};
