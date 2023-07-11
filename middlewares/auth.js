import { User } from "../models/UserModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { catchAsyncError } from "./catchAsyncError.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Not Logged In", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded);

  next();
});

export const adminAuth=(req,res,next)=>{
  if(req.user.role!=='admin')
  {
    return next(new ErrorHandler(`${req.user.role} is not allowed to access this resource`),403)
  }

  next()
}


export const AuthSubscribers=(req,res,next)=>{
  if(req.user.subscription.status!=='active' && req.user.role!=='admin')
  {
    return next(new ErrorHandler(`Only Subscribed user can access this course`),403)
  }

  next()
}