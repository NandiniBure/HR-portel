import API from "@/middlewear/ClientApi"; // Use the axios instance with interceptors

export const getAllAttendance = async (date: string, search: string = "") => {
  try {
    if (!date) {
      throw new Error("date is required to fetch all attendance records");
    }

    const response = await API.get("/attendance", {
      params: { date, search },
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching all attendance:",
      error?.response?.data?.message || error.message
    );
    throw new Error(
      error?.response?.data?.message ||
      error.message ||
      "Something went wrong while fetching all attendance"
    );
  }
};