import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

// Middleware para permitir CORS
app.use(cors());

// Rotas do backend
app.use("/", routes);

export default app;
