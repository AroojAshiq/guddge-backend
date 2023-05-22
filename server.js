import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import connectDb from "./config/db.js";
import router from "./routes/userRoutes.js";
import path from "path";
import route from "./routes/userProfileUpload.js";

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

const MONGO_DB = process.env.MONGO_DB;
mongoose.set("strictQuery", true);
const isConnected = await connectDb(MONGO_DB);

app.use("/quanks", router);
app.use(express.urlencoded({ extended: true, limit: "500mb" }));
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use("/quanks", route);

if (process.env.NODE_ENV === "PRODUCTION") {
  app.use(express.static(path.join(__dirname, "./build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

app.get("/", (req, res) => {
  res.send("home");
});

const port = process.env.PORT;
app.listen(port, (req, res) => {
  if (isConnected) console.log(`server is running on port ${port}`);
});
