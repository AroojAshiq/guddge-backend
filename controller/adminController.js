import Admin from "../model/adminModel.js";
import jwt from "jsonwebtoken";

const createAdmin = async (req, res) => {
  const {
    adminName,
    email,
    jobTitle,
    phoneNumber,
    DOB,
    joiningDate,
    totalYearExperince,
    guddgeEmailPlan,
    agreement,
    agreementEndDate,
  } = req.body;
  const user = await Admin.findOne({ email: email });
  if (user) {
    res.status(400).json({
      success: false,
      message: "Admin already exist against this email",
    });
  } else {
    if (
      (adminName && email && jobTitle && phoneNumber,
      DOB &&
        joiningDate &&
        totalYearExperince &&
        guddgeEmailPlan &&
        agreement &&
        agreementEndDate)
    ) {
      try {
        const newUser = new Admin({
          adminName: adminName,
          email: email,
          jobTitle: jobTitle,
          phoneNumber: phoneNumber,
          DOB: DOB,
          joiningDate: joiningDate,
          totalYearExperince: totalYearExperince,
          guddgeEmailPlan: guddgeEmailPlan,
          agreement: agreement,
          agreementEndDate: agreementEndDate,
        });
        await newUser.save();

        const saveUser = await Admin.findOne({ email: email });
        const token = jwt.sign(
          { userId: saveUser._id },
          process.env.JWT_SECRET,
          { expiresIn: "10d" }
        );
        res.status(200).json({
          success: true,
          message: "Admin created successful",
          userID: saveUser._id,
          adminName: saveUser.adminName,
          //   role: saveUser.role,
          token: token,
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({
          success: false,
          mesaage: "Something wents wrong",
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Please fill empty fields",
      });
    }
  }
};

export { createAdmin };
