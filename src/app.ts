import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import eventRoutes from "./routes/eventRoutes";
import { loadTokens } from "./utils/tokenUtils";

const app = express();

// Middleware para permitir CORS
// Configura o CORS para permitir requisições do frontend
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET"],
    allowedHeaders: ["Content-Type", "Authorization", "Timezone"],
    credentials: true,
  })
);

// Carrega os tokens ao iniciar o servidor
loadTokens();

// Rotas do backend
app.use(express.json());
// Rotas
app.use("/", authRoutes);
app.use("/", eventRoutes);

export default app;
