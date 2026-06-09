import express from "express"

import { createEmployeeController, getEmployeesController, getEmployeeByIDController, updateEmployeeController, deleteEmployeeController, loginUserController } from "../controllers/employee.controller.js";
import { validate, validateUpdateUser, validateLoginUser } from "../validators/employeeValidator.js";

const router = express.Router();

router.post("/", createEmployeeController);

router.get("/", getEmployeesController);

router.get('/:empId', getEmployeeByIDController)

router.patch('/:id', validateUpdateUser, validate, updateEmployeeController)

router.delete('/:id', deleteEmployeeController)

router.post("/login", validateLoginUser,loginUserController);

export default router;
