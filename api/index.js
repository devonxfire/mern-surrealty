import express from "express";
import { connectDB } from "./config/connectDB.js";

import authRouter from "./routes/auth.route.js";

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());

// Routes

app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({ message, statusCode, success: false });
});

app.listen(3000, () => console.log("Server listening on port 3000..."));

//devon
//devon123
