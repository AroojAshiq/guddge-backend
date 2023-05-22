import mongoose from "mongoose";
import User from "./userModel.js";

const playSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: User,
    required: true,
  },
  quiz_id: {
    type: mongoose.Types.ObjectId,
    ref: User,
    required: true,
  },
  favorite: false,
  scores: Number,
  totalQuestions: Number,
  title: String,
  timestamp: { type: Date, default: Date.now },
});

const playModel = new mongoose.model("played_qestion", playSchema);

export default playModel;
