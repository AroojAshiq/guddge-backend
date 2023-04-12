import { timeSheetData } from "../controller/timeSheetController.js";
import express from "express";

const timeSheetRouter = express.Router();

timeSheetRouter.post("/dashboard/view-time-sheets", timeSheetData);

export default timeSheetRouter;
