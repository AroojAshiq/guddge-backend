import TimeSheet from "../model/timeSheetModel.js";

const timeSheetData = async (req, res) => {
  if (req.body !== null && req.body !== undefined) {
    try {
      const dataSheet = await new TimeSheet(req.body);
      res.status(200).json({
        success: true,
        message: "Data submitted successfully",
        dataSheet,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: "Something wents wrong",
      });
    }
  } else {
    res.status(404).json({
      success: false,
      message: "Something wents wrong",
    });
  }
};

export { timeSheetData };
