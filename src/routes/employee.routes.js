import express from "express"

import { createEmployeeController, getEmployeesController } from "../controllers/employee.controller.js";

const router = express.Router();

router.post("/", createEmployeeController);

router.get("/", getEmployeesController);

export default router;
