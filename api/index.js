import express from "express";
import { connectDB } from "./config/connectDB.js";
import userRouter from "./routes/user.route.js";

// Connect to MongoDB
connectDB();

const app = express();

// Routes
app.use("/api/user", userRouter);

app.listen(3000, () => console.log("Server listening on port 3000..."));

//devon
//devon123
