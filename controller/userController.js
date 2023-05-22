import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { get } from "mongoose";

const client = new OAuth2Client(process.env.AUTH_ID);

const Signup = async (req, res) => {
  const { userName, email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (user) {
    res.status(400).json({
      success: false,
      message: "User already registered against this email",
    });
  } else {
    if (userName && email && password) {
      try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
          userName: userName,
          email: email,
          password: hashPassword,
        });
        await newUser.save();

        const saveUser = await User.findOne({ email: email });
        const token = jwt.sign(
          { userId: saveUser._id },
          process.env.JWT_SECRET,
          { expiresIn: "30d" }
        );
        res.status(200).json({
          success: true,
          message: "Signup successful",
          userID: saveUser._id,
          userName: saveUser.userName,
          email: saveUser.email,
          token: token,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          mesaage: "Something wents wrong",
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "please fill empty fields",
      });
    }
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const user = await User.findOne({ email: email });
      if (user != null) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (user.email == email && isMatch) {
          const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
          });

          res.status(200).json({
            success: true,
            message: "Logedin Successfully",
            userId: user._id,
            userName: user.userName,
            email: user.email,
            lastPlayedQuizId: user.lastPlayedQuizId,
            filename: user.filename,
            bio: user?.bio,
            city: user.city,
            country: user?.country,
            token: token,
          });
        } else {
          res.status(400).json({
            success: false,
            message: "email and password is not matched",
          });
        }
      } else {
        res.status(400).json({
          success: false,
          message: "user is not registered",
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "please fill empty fields",
      });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const googleLogin = async (req, res) => {
  const { token } = req.body;
  try {
    if (token) {
      client
        .verifyIdToken({
          idToken: token,
          audience: process.env.AUTH_ID,
        })
        .then(async (response) => {
          const { email_verified, name, picture, email } =
            response.getPayload();
          if (email_verified) {
            const user = await User.findOne({ email: email });

            if (user) {
              const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                {
                  expiresIn: "30d",
                }
              );
              res.status(200).json({
                success: true,
                message: "Logedin Successfully",
                userId: user._id,
                userName: user.userName,
                email: user.email,
                picture: user.picture,
                token: token,
              });
            } else {
              let password = email + process.env.JWT_SECRET;
              let newUser = new User({
                userName: name,
                email: email,
                password: password,
                picture: picture,
              });
              await newUser.save();
              const userAuth = await User.findOne({ email: email });
              const token = jwt.sign(
                { userId: userAuth._id },
                process.env.JWT_SECRET,
                {
                  expiresIn: "30d",
                }
              );
              res.status(200).json({
                success: true,
                message: "Logedin Successfully",
                userId: userAuth._id,
                userName: userAuth.userName,
                email: userAuth.email,
                picture: userAuth.picture,
                token: token,
              });
            }
          } else {
            res.status(400).json({
              success: false,
              message: "Email is not verified against google",
            });
          }
        })
        .catch((err) => console.log(err));
    }
  } catch (error) {
    res.status(500).json(error.message);
    console.log(error);
  }
};

const changePasswordAndUpdate = async (req, res) => {
  const { password, new_password } = req.body;
  const { id } = req.params;

  const user = await User.findById(id);
  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      try {
        if (password && new_password && password !== new_password) {
          const salt = await bcrypt.genSalt(10);
          const newHashPassword = await bcrypt.hash(new_password, salt);
          await User.findByIdAndUpdate(user._id, {
            password: newHashPassword,
          });
          res.status(201).json({
            success: true,
            message: "Password Updated Successfully",
          });
        } else {
          res.status(400).json({
            success: false,
            message: "your password is same as previous password",
          });
        }
      } catch (error) {
        console.log(error.message);
      }
    } else {
      res.status(400).json({
        success: false,
        message: "current password is not correct",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "user not found",
    });
  }
};

const basicInfo = async (req, res) => {
  const { userName, email, gender } = req.body;
  const { id } = req.params;
  const user = await User.findById(id);

  if (user) {
    user.userName = userName || user.userName;
    user.email = email || user.email;
    user.gender = gender || user.gender;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Info updated",
      _id: updatedUser._id,
      userName: updatedUser.userName,
      email: updatedUser.email,
      gender: updatedUser.gender,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "User not Found",
    });
  }
};

const lastPalyedQuiz = async (req, res) => {
  const { lastPlayedQuizId } = req.body;
  const { id } = req.params;
  const user = await User.findById(id);

  if (user) {
    user.lastPlayedQuizId = lastPlayedQuizId || user.lastPlayedQuizId;

    const updatedUser = await user.save();
    res.status(200).json({
      success: true,
      message: "last played quiz id stored in db.",
      updatedUser,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "id not found",
    });
  }
};

export {
  Login,
  Signup,
  changePasswordAndUpdate,
  basicInfo,
  googleLogin,
  lastPalyedQuiz,
};
