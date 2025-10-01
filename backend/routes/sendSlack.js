import express from "express";
import sendSlackController from "../controllers/sendSlack.js";

const router = express.Router();

router.post("/send-slack", sendSlackController.send);

export default router;