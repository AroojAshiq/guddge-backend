import mongoose from "mongoose";
import CreateQuestionModel from "../model/createQuestionModel.js";

const createQuiz = async (req, res) => {
  const { quizTitle, userName, quizdesc, questions, user_id } = req.body;
  try {
    const quiz = await new CreateQuestionModel({
      user_id,
      userName,
      quizTitle,
      quizdesc,
      questions,
    });
    const data = await quiz.save();
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getQuestions = async (req, res) => {
  const { id } = req.params;
  const questions = await CreateQuestionModel.findById(id);
  if (questions) {
    res.json(questions);
  } else {
    res.status(404).json({
      success: false,
      message: "Questions not found",
    });
  }
};

const createdByUser = async (req, res) => {
  const { q } = req.query;
  const page = req.query.page || 1;
  const itemPerPage = 10;
  const keys = ["quizTitle"];
  const skip = (page - 1) * itemPerPage;
  const count = await CreateQuestionModel.countDocuments(q);

  const questions = await CreateQuestionModel.find()
    .sort({ timestamp: -1 })
    .limit(itemPerPage)
    .skip(skip);
  const search = (data) => {
    return data.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(q))
    );
  };
  const pageCount = Math.ceil(count / itemPerPage);

  if (questions) {
    q
      ? res.status(200).json({
          quizByUser: search(questions),
          pagination: {
            count,
            pageCount,
          },
        })
      : res.status(200).json({
          pagination: {
            count,
            pageCount,
          },
          quizByUser: questions,
        });
  } else {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
};

const Mybanks = async (req, res) => {
  const { id } = req.params;
  const { q } = req.query;
  const page = req.query.page || 1;
  const itemPerPage = 8;
  const keys = ["quizTitle"];
  if (id) {
    try {
      const skip = (page - 1) * itemPerPage;
      const count = await CreateQuestionModel.countDocuments(q);
      const quizByUser = await CreateQuestionModel.find({ user_id: id })
        .sort({ timestamp: -1 })
        .limit(itemPerPage)
        .skip(skip);
      const findAll = await CreateQuestionModel.find({ user_id: id })
        .sort({ timestamp: -1 })
        .limit(itemPerPage)
        .skip(skip);

      const pageCount = Math.ceil(count / itemPerPage);

      const search = (data) => {
        return data.filter((item) =>
          keys.some((key) => item[key].toLowerCase().includes(q))
        );
      };

      if (quizByUser) {
        q
          ? res.status(200).json({
              quizByUser: search(findAll),
              pagination: {
                count,
                pageCount,
              },
            })
          : res.status(200).json({
              pagination: {
                count,
                pageCount,
              },
              quizByUser: quizByUser,
            });
      } else {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "No quiz is created by this user",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Unexpexted error",
    });
  }
};

const editQuiz = async (req, res) => {
  const { id } = req.params;
  const { user_id, userName, quizTitle, quizdesc, questions } = req.body;
  if (id) {
    const edit = await CreateQuestionModel.findByIdAndUpdate(
      { _id: id },
      {
        user_id: user_id,
        userName: userName,
        quizTitle: quizTitle,
        quizdesc: quizdesc,
        questions: questions,
      }
    );
    res.status(200).json({
      success: true,
      message: "quiz updated successfully",
      edit,
    });
  } else {
    res.status(400).json({
      success: false,
      message: "quiz not found",
    });
  }
};

const deleteMyBankQuizById = async (req, res) => {
  const { quiz_id } = req.params;
  if (quiz_id) {
    try {
      const deleteQuiz = await CreateQuestionModel.findByIdAndDelete(quiz_id);
      res.status(200).json({
        success: true,
        message: "Quiz Deleted successfully",
        deleteQuiz,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Something wents wrong",
      });
    }
  } else {
    res.status(500).json({
      success: false,
      message: "Quiz is not deleted",
    });
  }
};

const createQuizByMultipleQuiz = async (req, res) => {
  const { userId } = req.params;
  try {
    let ids = req.body.map((id) => mongoose.Types.ObjectId(id)) ?? [];
    // ids = await CreateQuestionModel.find({ _id: { $in: ids } });
    const result = await CreateQuestionModel.aggregate([
      { $match: { _id: { $in: ids } } },
      {
        $group: {
          _id: null,
          data: { $push: "$$ROOT" },
          // questions: { $push: "$$ROOT", questions: questions },
        },
      },
      {
        $unwind: {
          path: "$data",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $replaceRoot: { newRoot: "$data" },
      },
      {
        $unwind: {
          path: "$questions",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $replaceRoot: { newRoot: "$questions" },
      },
    ]).exec();
    const quiz = await CreateQuestionModel.insertMany({
      quizTitle: "random quiz",
      user_id: userId,
      questions: result,
    });
    res.status(200).json({
      success: true,
      message: "Successfully",
      quiz,
    });
  } catch (error) {
    console.log(error);
  }
};

export {
  createQuiz,
  getQuestions,
  createdByUser,
  Mybanks,
  deleteMyBankQuizById,
  editQuiz,
  createQuizByMultipleQuiz,
};
