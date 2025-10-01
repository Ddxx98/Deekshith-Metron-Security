import express from "express";
import checkPasswordController from "../controllers/checkPassword.js";

const router = express.Router();

router.post("/check-password", checkPasswordController.check);

export default router;