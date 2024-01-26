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

app.listen(3000, () => console.log("Server listening on port 3000..."));

//devon
//devon123
