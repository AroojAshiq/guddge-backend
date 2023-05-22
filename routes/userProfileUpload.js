import path from "path";
import express from "express";
import multer from "multer";
import User from "../model/userModel.js";
import fs from "fs";
const route = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.${file.originalname}`);
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|jfif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("filenames only!");
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

route.put(
  "/setting/profile/:id",
  upload.single("filename"),
  async (req, res) => {
    const { userName, city, country, bio } = req.body;
    const { id } = req.params;
    const filename = req?.file?.filename;
    if (!userName && !city && !country && !bio && !filename) {
      res.status(400).json({
        success: false,
        message: "please enter all fields",
      });
    } else {
      try {
        const user = await User.findById(id);
        if (user) {
          if (user?.filename?.length && filename?.length) {
            removeImage(user?.filename);
          }
          // console.log("user.filename ", user.filename, filename);
          user.userName = userName || user.userName;
          user.city = city || user.city;
          user.country = country || user.country;
          user.bio = bio || user.bio;
          user.filename = filename ?? user.filename;
          const saveUser = await user.save();

          if (saveUser) {
            res.status(200).json({
              success: true,
              message: "success",
              user: {
                userName: saveUser?.userName,
                filename: saveUser?.filename,
                city: saveUser?.city,
                country: saveUser?.country,
                bio: saveUser?.bio,
              },
            });
          } else {
            res.status(400).json({
              success: false,
              message: "something wents wrong",
            });
          }
        }
      } catch (error) {
        console.log(error);
        res.status(400).json({
          success: false,
          message: "something wents wrong",
        });
      }
    }
  }
);

export default route;

const removeImage = (file) => {
  fs.unlink("./uploads/" + file, function (err) {
    if (err && err.code == "ENOENT") {
      // file doens't exist
      console.info("File doesn't exist, won't remove it.");
    } else if (err) {
      // other errors, e.g. maybe we don't have enough permission
      console.error("Error occurred while trying to remove file");
    } else {
      console.info(`removed`);
    }
  });
};
