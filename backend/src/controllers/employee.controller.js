import { BadrequestError } from "../utils/error.js"
import { createEmployeeService, getEmployeesService, fetchEmployeeService, updateEmployeeDetailsService, validateAndIssueToken, deleteEmployeeService } from "../services/employee.service.js";
import { invalidate } from "../utils/cache.js";

const updatedFields = new Set(['fullName', 'email', 'department', 'jobTitle', 'age', 'salary']);

export const createEmployeeController = async (req, res, next) => {
    try {

        const employee = await createEmployeeService(req.body);
        await invalidate(employee.country)

        return res.status(201).json({
            success: true,
            data: employee,
        });
    } catch (err) {
        next(err);
    }
};

export const getEmployeesController = async (req, res, next) => {
    try {
        const { page, limit, search, country, department, sortBy, sortOrder } = req.query;

        const data = await getEmployeesService({
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            search: search || "",
            country: country || "",
            department: department || "",
            sortBy: sortBy || "id",
            sortOrder: sortOrder || "desc",
        });

        res.status(200).json({
            success: true,
            ...data,
        });
    } catch (err) {
        next(err);
    }
};

export const getEmployeeByIDController = async (req, res, next) => {
    const { id } = req.params;
    try {
        if (!id) {
            throw new BadrequestError('Employee Id is required.')
        }
        const fetchEmployeeData = await fetchEmployeeService(id)
        res.status(200).json({
            success: true,
            data: fetchEmployeeData
        })
    } catch (err) {
        next(err)
    }
}

export const updateEmployeeController = async (req, res, next) => {
    const { id } = req.params
    try {
        const updates = {};
        for (const [key, value] of Object.entries(req.body)) {
            if (updatedFields.has(key)) updates[key] = value;
        }

        if (Object.keys(updates).length === 0) {
            throw new BadrequestError('No valid fields provided for update.')
        }
        if (!id) {
            throw new BadrequestError("Id is required!")
        }
        const updateEmployee = await updateEmployeeDetailsService(updates, id)
        if (updateEmployee) {
            return res.status(200).json({ status: true, message: 'Employee updated successfully.' })
        }
    } catch (err) {
        next(err)
    }
}

export const deleteEmployeeController = async (req, res, next) => {
    const { id } = req.params;

    try {
        if (!id) {
            throw new BadrequestError("Employee Id is required");
        }

        const deleteEmployee = await deleteEmployeeService(id)
        if (deleteEmployee) {
            return res.status(200).json({
                success: true,
                message: "Employee deleted successfully.",
            });
        }

    } catch (err) {
        next(err);
    }
};

export const loginUserController = async (req, res, next) => {
    const { email, password } = req.body
    try {
        if (!email) {
            throw new BadrequestError('Email is required Field.')
        }
        if (!password) {
            throw new BadrequestError('Password is required Field.')
        }
        const validateUser = await validateAndIssueToken(email, password)
        res.cookie("accessToken", validateUser.accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        return res.json({
            success: true,
            email: validateUser.email,
            message: "Login successful",
        });
    } catch (err) {
        next(err)
    }
}
