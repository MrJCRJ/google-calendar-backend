import { Router } from "express";
import {
  listEvents,
  startAuth,
  handleAuthCallback,
} from "../controllers/calendar";

const router = Router();

// Rota para iniciar o fluxo de autenticação
router.get("/auth/google", startAuth);

// Rota de callback após a autenticação
router.get("/auth/callback", handleAuthCallback);

// Rota para listar eventos do Google Calendar
router.get("/events", listEvents);

export default router;
