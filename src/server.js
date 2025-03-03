import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./router/authRoutes.js";
import studentRoutes from "./router/studentRoutes.js";
import authMiddleWare from "./middleware/authMiddleWare.js";
const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
const PORT = process.env.PORT||3002;
app.use("/auth", authRoutes);
app.use("/student",authMiddleWare, studentRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
