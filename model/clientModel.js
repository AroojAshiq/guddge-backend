import mongoose from "mongoose";

const clientSchema = mongoose.Schema({
  clientName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  jobTitle: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  DOB: {
    type: Date,
    required: true,
  },
  joiningDate: {
    type: Date,
    required: true,
  },
  totalYearExperince: {
    type: Number,
    required: true,
  },
  guddgeEmailPlan: {
    type: String,
    required: true,
    trim: true,
  },
  agreement: {
    type: String,
    required: true,
    trim: true,
  },
  agreementEndDate: {
    type: Date,
    required: true,
  },
  role: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Client = mongoose.model("Client", clientSchema);

export default Client;
