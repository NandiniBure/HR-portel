import API from "@/middlewear/ClientApi"; // ✅ your interceptor-based axios instance

export const checkInAttendance = async (employeeId?: string) => {
  try {
    if (!employeeId) {
      throw new Error("employeeId is required for check-in");
    }

    const res = await API.post("/attendance/check-in", {
      employee_id: employeeId,
    });

    return res.data;
  } catch (e: any) {
    throw new Error(
      e?.response?.data?.message ||
        e.message ||
        "An error occurred during attendance check-in"
    );
  }
};
