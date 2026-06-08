import express from "express"
import { errorHandler } from "../src/middleware/errorMiddleware.js"
import employeeRoutes from "../src/routes/employee.routes.js"
import cors  from "cors"
import dotenv from "dotenv"

dotenv.config()
const app = express();

app.use(cors());
app.use(express.json());


app.use(errorHandler);

app.use("/api/employees", employeeRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

export default app;
