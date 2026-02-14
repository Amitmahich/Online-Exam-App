const JWT = require("jsonwebtoken");
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");

//register
const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    //validation
    if (!name || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "Please provide all required fields!",
      });
    }
    //checking user already exist ?????
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(409).send({
        success: false,
        message: "Email already registered, Please sign in!",
      });
    }
    //hashing password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
    user.password = undefined;
    res.status(201).send({
      success: true,
      message: "Registered Successfully!",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Register API",
      error,
    });
  }
};
//login
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Please provide email and password!",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found!",
      });
    }
    //compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Invalid Email and password!",
      });
    }

    //jwt setup
    const token = JWT.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    //password hide
    user.password = undefined;

    res.status(200).send({
      success: true,
      message: "Login successfully!",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Login API",
      error,
    });
  }
};

module.exports = { registerController, loginController };
