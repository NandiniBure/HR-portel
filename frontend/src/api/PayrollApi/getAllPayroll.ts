import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_BASE_URL}payroll`;

/**
 * Fetch all payroll records from the backend.
 * @returns {Promise<any>} The response data containing all payroll records.
 */
export const getAllPayroll = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/all/payrolls`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    // Optionally handle/log error
    throw error;
  }
};
