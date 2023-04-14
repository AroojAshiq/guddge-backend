import dotenv from "dotenv";
import users from "./data/users.js";
import User from "./model/userModel.js";
import connnectDb from "./config/db.js";
import mongoose from "mongoose";

dotenv.config();

const MONDO_DB = process.env.DATABASE_URL;
connnectDb(MONDO_DB);

const importData = async () => {
  try {
    const createdUsers = await User.insertMany(users);

    // const adminUser = createdUsers[0]._id

    // const sampleProducts = products.map((product) => {
    //   return { ...product, user: adminUser }
    // })

    // await Product.insertMany(sampleProducts)

    console.log("Data Imported!");
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// const destroyData = async () => {
//   try {
//     await Order.deleteMany();
//     await Product.deleteMany();
//     await User.deleteMany();

//     console.log("Data Destroyed!".red.inverse);
//     process.exit();
//   } catch (error) {
//     console.error(`${error}`.red.inverse);
//     process.exit(1);
//   }
// };

// if (process.argv[2] === "-d") {
//   destroyData();
// } else {
importData().then(() => {
  mongoose.connection.close();
});
// }
