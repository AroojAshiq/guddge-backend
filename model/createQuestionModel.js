import mongoose from "mongoose";
import User from "./userModel.js";

const questionSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: User,
    required: true,
  },
  userName: String,
  quizTitle: String,
  quizdesc: String,
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: [String],
    },
  ],
  timestamp: { type: Date, default: Date.now },
});

const createQuestionModel = new mongoose.model("quiz_qestion", questionSchema);

export default createQuestionModel;
