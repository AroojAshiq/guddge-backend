import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  userName: {
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
  password: {
    type: String,
    required: true,
    trim: true,
  },
  bio: String,
  city: String,
  country: String,
  gender: String,
  filename: String,
  picture: String,
  lastPlayedQuizId: String,
});

const User = new mongoose.model("User", userSchema);

export default User;
