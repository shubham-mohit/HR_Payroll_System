import express from "express"

import { createEmployeeController, getEmployeesController, getEmployeeByIDController, updateEmployeeController, deleteEmployeeController, loginUserController } from "../controllers/employee.controller.js";
import { validate, validateUpdateUser, validateLoginUser } from "../validators/employeeValidator.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createEmployeeController);

router.post("/login", validateLoginUser, loginUserController);

router.get("/", authenticate, getEmployeesController);

router.get('/:id', authenticate, getEmployeeByIDController)

router.patch('/:id', authenticate, validateUpdateUser, validate, updateEmployeeController)

router.delete('/:id', authenticate, deleteEmployeeController)


export default router;
