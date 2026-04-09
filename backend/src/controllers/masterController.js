import {
    getDepartmentsService,
    getDesignationsService,
} from "../services/masterService.js";

export const getDepartmentsController = async (req, res) => {
    try {
        const departments = await getDepartmentsService();

        return res.status(200).json({
            success: true,
            message: "Departments fetched successfully",
            data: departments,
        });
    } catch (error) {
        console.error("Get Departments Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch departments",
        });
    }
};

export const getDesignationsController = async (req, res) => {
    try {
        const designations = await getDesignationsService();

        return res.status(200).json({
            success: true,
            message: "Designations fetched successfully",
            data: designations,
        });
    } catch (error) {
        console.error("Get Designations Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch designations",
        });
    }
};