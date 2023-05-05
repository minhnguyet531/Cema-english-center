import express from "express";
import { config } from "dotenv";
import colors from "colors";
import cookieParser from "cookie-parser";
import ErrorMiddleware from "./middlewares/Error.js";

config({ path: "./config/config.env" });

const app = express();

// Using Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// All Routes Import
import course from "./routes/courseRoutes.js";
import user from "./routes/userRoutes.js";

// All Routes prefix
app.use("/api/v1", course);
app.use("/api/v1", user);

app.use(ErrorMiddleware);

export default app;
