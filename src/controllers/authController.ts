import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import AuthConfig from "../config/authConfig";
import { hash } from "bcrypt";
import ResponseUtil from "../utils/Response/responseUtils";
import {
  createProfileSchema,
  otpSendSchema,
  otpVerifySchema,
  signupSchema,
} from "../validators/authValidators";
import { compareSync } from "bcrypt";
import { generateToken } from "../utils/Token";
import { randomInt } from "crypto";
import { sendEmail } from "../utils/SendEmail";
import { emailTemplateGeneric } from "../utils/SendEmail/templates";
import { OtpModel } from "../models/OtpModel";
import { AUTH_CONSTANTS } from "../constants/messages";
import { STATUS_CODES } from "../constants/statusCodes";

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = signupSchema.parse(req.body);
    const userExist = await UserModel.findOne({
      email: email,
    });
    if (userExist) {
      return ResponseUtil.errorResponse(
        res,
        STATUS_CODES.BAD_REQUEST,
        AUTH_CONSTANTS.USER_ALREADY_EXISTS
      );
    }
    const hashPassword = await hash(password, String(AuthConfig.SALT));
    const user = await UserModel.create({
      email: email,
      password: hashPassword,
    });
    const otp = randomInt(1000, 9999);
    await OtpModel.create({
      userId: user._id,
      otp: String(otp),
    });
    const template = emailTemplateGeneric(otp, "registration");
    await sendEmail(email, AUTH_CONSTANTS.VERIFICATION_CODE, template);
    return ResponseUtil.successResponse(
      res,
      STATUS_CODES.SUCCESS,
      { user },
      AUTH_CONSTANTS.OTP_SENT
    );
  } catch (error: any) {
    ResponseUtil.handleError(res, error);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = signupSchema.parse(req.body);
    const user = await UserModel.findOne({ email });

    if (!user) {
      return ResponseUtil.errorResponse(
        res,
        STATUS_CODES.NOT_FOUND,
        AUTH_CONSTANTS.USER_NOT_FOUND
      );
    }

    const hashpass = compareSync(password, String(user.password));

    if (!hashpass) {
      return ResponseUtil.errorResponse(
        res,
        STATUS_CODES.BAD_REQUEST,
        AUTH_CONSTANTS.PASSWORD_MISMATCH
      );
    }
    const token = generateToken({
      email: email,
      id: String(user._id),
    });

    delete user.password;
    delete user.__v;

    if (!user.isVerified) {
      return ResponseUtil.errorResponse(
        res,
        STATUS_CODES.BAD_REQUEST,
        AUTH_CONSTANTS.NOT_VERIFIED
      );
    }

    if (!user.isProfileCompleted) {
      return ResponseUtil.errorResponse(
        res,
        STATUS_CODES.BAD_REQUEST,
        AUTH_CONSTANTS.INCOMPLETE_PROFILE
      );
    }

    return ResponseUtil.successResponse(
      res,
      STATUS_CODES.SUCCESS,
      { user, token },
      AUTH_CONSTANTS.LOGGED_IN
    );
  } catch (err) {
    ResponseUtil.handleError(res, err);
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { otp, userId } = otpVerifySchema.parse(req.body);
    const otpRes = await OtpModel.findOne({ userId });
    if (otpRes && otpRes.otp != otp) {
      return ResponseUtil.errorResponse(
        res,
        STATUS_CODES.BAD_REQUEST,
        AUTH_CONSTANTS.OTP_MISMATCH
      );
    }
    if (otpRes && new Date() > otpRes.expiry) {
      return ResponseUtil.errorResponse(
        res,
        STATUS_CODES.BAD_REQUEST,
        AUTH_CONSTANTS.OTP_EXPIRED
      );
    }

    const user = await UserModel.findByIdAndUpdate(userId, {
      isVerified: true,
    });
    if (user && user.email) {
      const token = generateToken({
        email: user.email,
        id: userId,
      });
      return ResponseUtil.successResponse(
        res,
        STATUS_CODES.SUCCESS,
        { token },
        AUTH_CONSTANTS.OTP_VERIFIED
      );
    }
    return ResponseUtil.errorResponse(
      res,
      STATUS_CODES.BAD_REQUEST,
      AUTH_CONSTANTS.USER_NOT_FOUND
    );
  } catch (err) {
    ResponseUtil.handleError(res, err);
  }
};

export const createProfile = async (req: Request, res: Response) => {
  try {
    const { name, age, gender } = createProfileSchema.parse(req.body);

    let picture: string;
    if (req.file) {
      picture = req.file.filename;
    }
    //Add your values here into database
    return ResponseUtil.successResponse(
      res,
      STATUS_CODES.SUCCESS,
      { name },
      AUTH_CONSTANTS.LOGGED_IN
    );
  } catch (err) {
    ResponseUtil.handleError(res, err);
  }
};

export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = otpSendSchema.parse(req.body);
    const user = await UserModel.findOne({ email });
    if (!user) {
      return ResponseUtil.errorResponse(
        res,
        STATUS_CODES.NOT_FOUND,
        AUTH_CONSTANTS.USER_NOT_FOUND
      );
    }
    const otp = randomInt(1000, 9999);
    await OtpModel.findByIdAndUpdate(user._id, { otp });
    const template = emailTemplateGeneric(otp, "OTP");
    await sendEmail(email, AUTH_CONSTANTS.VERIFICATION_CODE, template);
    return ResponseUtil.successResponse(
      res,
      STATUS_CODES.SUCCESS,
      {},
      AUTH_CONSTANTS.OTP_SENT
    );
  } catch (err) {
    ResponseUtil.handleError(res, err);
  }
};
