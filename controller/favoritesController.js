import playModel from "../model/playedByUserModel.js";

const favoriteQuiz = async (req, res) => {
  const { scores, favorite, user_id, totalQuestions, title } = req.body;
  const { id } = req.params;
  try {
    const quiz = new playModel({
      user_id,
      quiz_id: id,
      favorite,
      scores,
      totalQuestions,
      title,
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

const getFavoriteQuiz = async (req, res) => {
  const { id } = req.params;
  const { q } = req.query;
  const page = req.query.page || 1;
  const itemPerPage = 8;
  const keys = ["title"];

  if (id) {
    try {
      const skip = (page - 1) * itemPerPage;
      const count = await playModel.countDocuments(q);
      const quizByUser = await playModel
        .find({ user_id: id })
        .sort({ timestamp: -1 })
        .limit(itemPerPage)
        .skip(skip);
      const findAll = await playModel
        .find({ user_id: id })
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

const deleteFavQuiz = async (req, res) => {
  const { quiz_id } = req.params;
  if (quiz_id) {
    try {
      const deleteQuiz = await playModel.findByIdAndDelete(quiz_id);
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

export { favoriteQuiz, getFavoriteQuiz, deleteFavQuiz };
