import express from "express";
import { listEvents } from "../controllers/eventController";

const router = express.Router();

router.get("/events", listEvents);

export default router;
