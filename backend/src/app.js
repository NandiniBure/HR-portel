import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import employeeRoutes from "./routes/employeeRoute.js";
import authRoutes from "./routes/authRoute.js";
import leavesRoute from "./routes/leaveRoute.js";
import attendanceRoute from "./routes/attendanceRoute.js";
import payrollRoutes from "./routes/payrollRoute.js";
import departmentRoutes from "./routes/departmentRoute.js";
import designationRoutes from "./routes/designationRoute.js";
import masterRoutes from "./routes/masterRoutes.js";

const app = express();

app.set("trust proxy", 1);

app.use(express.json());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/payroll", payrollRoutes);
app.use("/api", attendanceRoute);
app.use("/api", leavesRoute);
app.use("/api", employeeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/designations", designationRoutes);
app.use("/api", masterRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "HR SaaS API is running 🚀",
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

export default app;
