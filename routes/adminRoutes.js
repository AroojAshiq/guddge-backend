import express from "express";
import { createAdmin } from "../controller/adminController.js";

const adminroute = express.Router();

adminroute.post("/dashboard/admin", createAdmin);

export default adminroute;
