import { Signup, Login } from "../controller/userController.js";
import express from "express";

const router = express.Router();

router.post("/registerbyemail", Signup);
router.post("/loginbyemail", Login);

export default router;
