import bcrypt from "bcrypt";
import AppError from "../../common/utils/appError.js";
import { catchAsync } from "../../common/utils/errorHandler.js";
import { UserModel } from "../../modules/schemas/user.schema.js";
import { createSendToken } from "../middlewares/index.js";

export const signup = catchAsync(async (req, res) => {
  const user = await new UserModel({
    username: req.body.username,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  }).save();  

  // ?? TODO Write code to send email to user after signup

  createSendToken(user, req, res, 201);
});

export const login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  // 1) check if the username and password is valid
  if (!username || !password) {
    return next(new AppError("Please provide your username and password", 400));
  }

  // 2) check if user exist && password is correct
  const user = await UserModel.findOne({ username }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect username or password", 401));
  }

  // 3) if everything is okay, send the token to the client
  createSendToken(user, req, res, 201);
});

export const biometricLogin = catchAsync(async (req, res, next) => {
  const password = req.body.password;

  if (!password) {
    return next(new AppError("Please provide password", 400));
  }
  const user = UserModel.findOne();
  await bcrypt.hash(password, 12);
  res.status(201).json({
    status: "success",
  });
});
