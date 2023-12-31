import { ENVIRONMENT } from "../../common/config/environment.js";
import AppError from "../../common/utils/appError.js";
import { catchAsync } from "../../common/utils/errorHandler.js";
import { createSendToken } from "../middlewares/index.js";
import { UserModel } from "../schemas/user.schema.js";
// const cloudinary = require( "cloudinary").v2;
import cloudinary from "cloudinary";


export const changeUsername = catchAsync(async (req, res,next) => { 
const {newUsername} = req.body;
if(!newUsername){
  return next(new AppError("please fill in your username", 401))
}
 await UserModel.findByIdAndUpdate(req.user.id, {username: newUsername})
res.status(200).json({
  status: true,
  message: "successfully change avatar",
})

})

export const changePassword = catchAsync(async (req, res, next) => {
  const {oldPassword, newPassword} = req.body;

  // check if old password is correct
  if(!oldPassword){
    return next(new AppError("invalid old password", 400))
  }
  // get old password from Db and validate if it is the same to the one sent
    const user = await UserModel.findById(req.user.id).select("+password")

    // const isCorrectPassword = await user.correctPassword(newPassword, oldPassword)
    const isCorrectPassword = await user.isValidatePassword(oldPassword)
  // check if the current password is correct
  if(!isCorrectPassword) return next(new AppError("your old password is not correct", 401))

  // after everything validate and save password
  user.password = newPassword;
  user.passwordConfirm = newPassword
  await user.save();


  // save details and send 
  createSendToken(user, req, res, 201);
  
})

export const changeProfileAvatar =  catchAsync(async (req, res) => {

  // cloudinary config
  cloudinary.config({
    cloud_name: ENVIRONMENT.APP.CLOUD_NAME,
    api_key:  ENVIRONMENT.APP.API_KEY,
    api_secret:  ENVIRONMENT.APP.API_SECRET,
  })

  let file = req.files.media
  const result = await cloudinary.v2.uploader.upload(file.tempFilePath,{
    folder: "users"
  })

  const photo = await UserModel.findOneAndUpdate({photo: result.secure_url})
  res.status(200).json({
    status: true,
    message: "success",
  })
  
})

/*
// cloudinary config
  cloudinary.config({
    cloud_name: ENVIRONMENT.APP.CLOUD_NAME,
    api_key:  ENVIRONMENT.APP.API_KEY,
    api_secret:  ENVIRONMENT.APP.API_SECRET,
  })

  cloudinary.v2.uploader.upload("assets/dp.jpg",(error, result)=>{
    console.log(result, error);
  });
*/