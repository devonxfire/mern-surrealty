import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/errorHandler.js";

// Signup
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const emailExists = await User.findOne({ email });
    const usernameExists = await User.findOne({ username });

    if (emailExists) {
      return next(errorHandler(400, "Email is already taken"));
    }
    if (usernameExists) {
      return next(errorHandler(400, "Username is already taken"));
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

// Sign in
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(errorHandler(404, "User does not exist"));
    }

    const validPassword = bcryptjs.compareSync(password, user.password);

    if (!validPassword) {
      return next(errorHandler(403, "Invalid credentials"));
    }

    const { password: pass, ...rest } = user._doc;

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};
