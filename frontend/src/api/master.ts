import axios from "axios";

export const fetchDepartments = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}departments`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error ||
        error.message ||
        "Failed to fetch departments"
    );
  }
};

export const fetchDesignations = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}designations`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error ||
        error.message ||
        "Failed to fetch designations"
    );
  }
};
