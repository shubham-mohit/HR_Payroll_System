import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import employeeRoutes from "../src/routes/employee.routes.js";
import insightRoutes from "../src/routes/insight.routes.js";
import { errorHandler } from "../src/middleware/errorMiddleware.js";
import { rateLimiter } from "../src/middleware/rateLimiter.js"

dotenv.config();

const app = express();

app.use(cors);
app.use(express.json());
app.use(cookieParser());
app.use(
  helmet({
    contentSecurityPolicy: false,
    xDownloadOptions: false,
  }),
);
app.use(rateLimiter);

// ROUTES
app.use("/api/employees", employeeRoutes);
app.use("/api/insight", insightRoutes)

// error handler
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

export default app;
