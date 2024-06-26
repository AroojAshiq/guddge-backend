import express from "express";
import { createContractor } from "../controller/contractorController.js";

const contractorRoute = express.Router();

contractorRoute.post("/dashboard/contractors", createContractor);

export default contractorRoute;
