import jwt from "jsonwebtoken";
import { DateTime } from "luxon";
import { promisify } from "util";
import { ENVIRONMENT } from "../../common/config/environment.js";
import AppError from "../../common/utils/appError.js";
import { catchAsync } from "../../common/utils/errorHandler.js";
import { UserModel } from "../schemas/user.schema.js";


/*
 ** create a signinToken for authentication
 */

export const signToken = (id) => {
  return jwt.sign({ id: id }, ENVIRONMENT.APP.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// create a sendToken

export const createSendToken = (user, req, res, statusCode) => {
  const token = signToken(user._id);
  res.cookie("jwt", token, {
    expires: DateTime.now().plus({ days: 7 }).toJSDate(),
    httpOnly: true,
    secure: req.secure || req.headers["x-forward-proto"] === "https",
  });

  //   Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
};

// protect auth routes from false attempts

export const protect = catchAsync(async (req, res, next) => {
  // Get the token and check if it still exist
  let token;

  if (req.headers.cookie) {
    token = req.headers.cookie.split(";")[0].split("=")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please login to get access", 401)
    );
  }

  // verification token
  const decoded = await promisify(jwt.verify)(
    token,
    ENVIRONMENT.APP.JWT_SECRET
  );

  // check if user still exist
  const currentUser = await UserModel.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exist", 401)
    );
  }

  // Grant access to protected route
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});
