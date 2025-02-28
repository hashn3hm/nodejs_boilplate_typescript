import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import morganBody from "morgan-body";
import { connectDB } from "./config/db";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express';
import authRoutes from "./routes/authRoutes";
import swaggerOptions from "./config/swagger";
import express, { Request, Response } from "express";
import { API_PREFIX } from "./config/environment";

dotenv.config();

const app = express();

connectDB();
app.get("/", (req: Request, res: Response) => {
  return res.json({ message: "Welcome to NodeJS Template" });
});

const swaggerSpec = swaggerJSDoc(swaggerOptions);
// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
app.use("/src/public/uploads", express.static("./src/public/uploads"));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

morganBody(app, {
  prettify: true,
  logReqUserAgent: true,
  logReqDateTime: true,
});

// Routes
app.use(`${API_PREFIX}/auth`, authRoutes);

export default app;
