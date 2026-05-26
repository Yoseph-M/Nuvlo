import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { User } from "../models/User.ts";
import { IUser } from "../models/User.ts";
import generateToken from "../utils/generateToken.ts";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/mailer.ts";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body as {
    name: string;
    email: string;
    password: string;
    role: "guest" | "host" | "admin";
  };

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || "guest",
    isVerified: false,
    verificationToken,
    verificationTokenExpires,
  });

  if (user) {
    try {
      await sendVerificationEmail(user.email, user.name, verificationToken);
    } catch (mailError) {
      console.error("Mailer error during registration:", mailError);
    }

    res.status(201).json({
      message: "Registration successful! Please check your email to verify your account.",
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    if (!user.isVerified) {
      res.status(403);
      throw new Error("Email not verified. Please check your inbox or resend the verification email.");
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Logout user (clear cookie)
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user?._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Verify user email
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;

  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: new Date() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired verification token");
  }

  user.isVerified = true;
  user.verificationToken = null;
  user.verificationTokenExpires = null;
  await user.save();

  res.status(200).json({
    message: "Email verified successfully! You can now log in.",
    email: user.email,
  });
});

// @desc    Resend email verification token
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerification = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body as { email: string };

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error("This email is already verified");
  }

  const token = crypto.randomBytes(32).toString("hex");
  user.verificationToken = token;
  user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  await user.save();

  try {
    await sendVerificationEmail(user.email, user.name, token);
  } catch (error) {
    res.status(500);
    throw new Error("Failed to send verification email. Please try again later.");
  }

  res.status(200).json({
    message: "Verification email resent successfully. Please check your inbox.",
  });
});

export { registerUser, loginUser, logoutUser, getUserProfile, verifyEmail, resendVerification };
