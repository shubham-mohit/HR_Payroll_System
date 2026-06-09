import { NotFoundError, BadrequestError } from "../utils/error.js"
import { createEmployee, getEmployees, fetchEmployee, updateEmployeeDetails, validateAndIssueToken } from "../services/employee.service.js";
import { employeeSchema } from "../validators/employee.validator.js"
import { prisma } from "../lib/prisma.js"

const updatedFields = new Set(['fullName', 'email', 'department', 'jobTitle', 'age', 'salary']);

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

export const getEmployeeByIDController = async (req, res, next) => {
    const { empId } = req.params;
    try {
        if (!empId) {
            return res.status(400).json({
                success: false,
                message: "EmpId is required!"
            });
        }
        const fetchEmployeeData = await fetchEmployee(empId)
        res.status(200).json({
            success: true,
            data: fetchEmployeeData
        })
    } catch (error) {
        next(error)
    }
}

export const updateEmployeeController = async (req, res, next) => {
    const { id } = req.params
    try {
        const updates = {};
        for (const [key, value] of Object.entries(req.body)) {
            if (updatedFields.has(key)) updates[key] = value;
        }

        // 2. Nothing left after stripping? (shouldn't reach here — validator catches it first)
        if (Object.keys(updates).length === 0) {
            return res.status(422).json({
                success: false,
                message: 'No valid fields provided for update.',
            });
        }
        if (!id) {
            throw new BadrequestError("Id is required!")
        }
        const updateEmployee = updateEmployeeDetails(updates, id)
        if (updateEmployee) {
            return res.status(200).json({ status: true, message: 'Employee updated successfully.' })
        }
    } catch (error) {
        next(error)
    }
}

export const deleteEmployeeController = async (req, res, next) => {
    const { id } = req.parms
    try {
        if (!id) {
            throw new BadrequestError('Employee Id is required')
        }
        const deleted = await prisma.user.updateMany({
            where: {
                id: userId,
                isDeleted: false,
            },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
            },
        });
        if (!deleted.count) {
            throw new NotFoundError('User not found or already deleted.')
        }
    } catch (error) {
        next(error)
    }
}

export const loginUserController = async (req, res, next) => {
    const {email, password} = req.body
    try {
        console.log(email)
        if(!email){
            throw new BadrequestError('Email is required Field')
        }
        if(!password){
            throw new BadrequestError('Password is required Field')
        }
        const validateUser = await validateAndIssueToken(email, password)
        res.cookie("accessToken", validateUser, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        return res.json({
            success: true,
            message: "Login successful",
        });
    } catch (error) {
    next(error)
}
}
