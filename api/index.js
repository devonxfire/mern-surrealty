import express from "express";
import { connectDB } from "./config/connectDB.js";

// Connect to MongoDB
connectDB();

const app = express();

app.listen(3000, () => console.log("Server listening on port 3000..."));

//devon
//devon123
