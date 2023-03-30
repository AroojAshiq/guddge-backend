import express from "express";
import { createClient } from "../controller/clientController.js";

const clientRoute = express.Router();

clientRoute.post("/dashboard/clients", createClient);

export default clientRoute;
