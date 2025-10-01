import express from "express";
import generatePasswordController from "../controllers/generatePassword.js";

const router = express.Router();

router.post("/generate-password", generatePasswordController.generate);

export default router;