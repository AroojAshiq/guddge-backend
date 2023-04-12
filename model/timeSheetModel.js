import mongoose from "mongoose";

const timeSheetSchema = mongoose.Schema({
  dataSheet: [
    {
      changeDate: String,
      ID: String,
      invoiceCategory: String,
      project: String,
      task: String,
      comments: String,
    },
  ],
});

const TimeSheet = mongoose.model("timeSheet", timeSheetSchema);

export default TimeSheet;
