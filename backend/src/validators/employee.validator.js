// src/validators/employee.validator.js

import { z } from "zod";

export const employeeSchema = z.object({
  employeeCode: z.string().min(3),

  fullName: z.string().min(3),

  email: z.string().email(),

  country: z.string().min(1),

  department: z.string().min(1),

  jobTitle: z.string().min(1),

  salary: z.number().positive(),

  currency: z.string().min(1),
});
