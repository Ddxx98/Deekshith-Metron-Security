import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import checkPasswordRoute from "./routes/checkPassword.js";
import generatePasswordRoute from "./routes/generatePassword.js";
import sendSlackRoute from "./routes/sendSlack.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use("/api", checkPasswordRoute);
app.use("/api", generatePasswordRoute);
app.use("/api", sendSlackRoute);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong.' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});