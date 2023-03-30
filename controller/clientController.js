import jwt from "jsonwebtoken";
import Client from "../model/clientModel.js";

const createClient = async (req, res) => {
  const {
    clientName,
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
  const user = await Client.findOne({ email: email });
  if (user) {
    res.status(400).json({
      success: false,
      message: "Client already exist against this email",
    });
  } else {
    if (
      (clientName && email && jobTitle && phoneNumber,
      DOB &&
        joiningDate &&
        totalYearExperince &&
        guddgeEmailPlan &&
        agreement &&
        agreementEndDate)
    ) {
      try {
        const newUser = new Client({
          clientName: clientName,
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

        const saveUser = await Client.findOne({ email: email });
        const token = jwt.sign(
          { userId: saveUser._id },
          process.env.JWT_SECRET,
          { expiresIn: "10d" }
        );
        res.status(200).json({
          success: true,
          message: "Client created successful",
          userID: saveUser._id,
          clientName: saveUser.clientName,
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

export { createClient };
