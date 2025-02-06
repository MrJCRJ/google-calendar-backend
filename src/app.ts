import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

// Middleware para permitir CORS
// Configura o CORS para permitir requisições do frontend
app.use(
  cors({
    origin: "*", // Permite todas as origens (apenas para teste)
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Rotas do backend
app.use(express.json());
app.use("/", routes);

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});

export default app;
