const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const { UserInputValidator } = require("../utils");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { message: errorMessage, status: validateStatus } =
      UserInputValidator.validateLoginDetails({ email, password });

    if (validateStatus) {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) res.status(404).json({ message: "User not found" });

      const userId = user.id;

      const checkPassword = bcrypt.compareSync(password, user.password);

      if (!checkPassword) res.status(401).json({ error: "Incorrect password" });

      delete user.password;

      const accessToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        {
          expiresIn: 86400,
        }
      );

      res.json({
        message: "Login Scuccessful",
        accessToken,
      });
    } else {
      res.json({
        message: errorMessage,
      });
    }
  } catch (error) {
    console.log("Something went wrong", err);
  }
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const { message: errorMessage, status: validateStatus } =
      UserInputValidator.validateRegisterDetails({ name, email, password });

    if (validateStatus) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const userExist = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (userExist) {
        res.json({ message: "User already exist" });
      }

      const user = await prisma.user.create({
        data: { id: uuidv4(), name, email, password: hashedPassword },
      });

      delete user.password;

      res.json({
        user,
      });
    } else {
      res.json({
        message: errorMessage,
      });
    }
  } catch (error) {
    console.log("Something went wrong", error);
  }
};
