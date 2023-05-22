import express from "express";
import {
  Login,
  Signup,
  changePasswordAndUpdate,
  basicInfo,
  googleLogin,
  lastPalyedQuiz,
} from "../controller/userController.js";
import {
  createdByUser,
  createQuiz,
  getQuestions,
  Mybanks,
  deleteMyBankQuizById,
  editQuiz,
  createQuizByMultipleQuiz,
} from "../controller/quizController.js";
import {
  favoriteQuiz,
  getFavoriteQuiz,
  deleteFavQuiz,
} from "../controller/favoritesController.js";
import checkAuthUser from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/google-login", googleLogin);
router.post("/create", checkAuthUser, createQuiz);
router.put("/create/:id/edit", checkAuthUser, editQuiz);
router.get("/create/:id/edit", checkAuthUser, getQuestions);
router.get("/search", createdByUser);
router.get("/bank/:id", checkAuthUser, Mybanks);
router.delete("/bank/:id/:quiz_id", deleteMyBankQuizById);
router.delete("/favBank/:id/:quiz_id", deleteFavQuiz);
router.get("/play/:id", getQuestions);
router.post("/play-quiz/:userId", createQuizByMultipleQuiz);
router.put("/:id", lastPalyedQuiz);
router.post("/play/:id", checkAuthUser, favoriteQuiz);
router.get("/favBank/:id", getFavoriteQuiz);
router.put("/setting/password/:id", checkAuthUser, changePasswordAndUpdate);
router.put("/setting/basicinfo/:id", checkAuthUser, basicInfo);

export default router;
