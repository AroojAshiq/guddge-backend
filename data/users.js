import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin",
    email: "admin@.com",
    password: bcrypt.hashSync("123456", 10),
    role: "Admin",
  },
  {
    name: "Sami",
    email: "sami@.com",
    password: bcrypt.hashSync("123456", 10),
    role: "Admin",
  },
  //   {
  //     name: "Jane Doe",
  //     email: "jane@example.com",
  //     password: bcrypt.hashSync("123456", 10),
  //   },
];

export default users;
