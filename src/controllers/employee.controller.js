import { createEmployee , getEmployees } from "../services/employee.service.js";
import { employeeSchema } from "../validators/employee.validator.js"

export const createEmployeeController = async (req, res, next) => {
    try {
        const result = employeeSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                errors: result.error.issues,
            });
        }

        const employee = await createEmployee(result.data);

        return res.status(201).json({
            success: true,
            data: employee,
        });
    } catch (error) {
        next(error);
    }
};

export const getEmployeesController = async (req, res, next) => {
    try {
        const data = await getEmployees({
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
            search: req.query.search || "",
        });

        res.json({
            success: true,
            ...data,
        });
    } catch (error) {
        next(error);
    }
};
