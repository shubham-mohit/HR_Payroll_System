import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import employeeRoutes from "../src/routes/employee.routes.js";
import { errorHandler } from "../src/middleware/errorMiddleware.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// routes FIRST
app.use("/api/employees", employeeRoutes);

// error handler LAST (VERY IMPORTANT)
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

export default app;
