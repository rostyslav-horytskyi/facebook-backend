import { Request, Response } from 'express';
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {validateEmail, validateLength, validateUsername} from "../helpers/validations";
import {generateToken} from "../helpers/tokens";
import {sendResetCode, sendVerificationEmail} from "../helpers/mailer";
import {AuthenticatedRequest, ErrorResponse, ResetPasswordRequestBody, UserResponse} from "../types";
import Code from "../models/Code";
import generateCode from "../helpers/generate-code";

export const register = async (req: Request, res: Response) => {
  const {
    first_name,
    last_name,
    email,
    password,
    bYear,
    bMonth,
    bDay,
    gender,
  } = req.body;

  if (!validateLength(first_name, 3, 30)) {
    return res.status(400).json({ message: 'First name must be between 3 to 30 characters' });
  }

  if (!validateLength(last_name, 3, 30)) {
    return res.status(400).json({ message: 'Last name must be between 3 to 30 characters' });
  }

  if (!validateLength(password, 6, 30)) {
    return res.status(400).json({ message: 'Password must be between 6 to 30 characters' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  const isEmailExist = await User.findOne({ email });

  if (isEmailExist) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const newUsername = await validateUsername(`${first_name}_${last_name}`);

  try {
    const user = await new User({
      first_name,
      last_name,
      username: newUsername,
      email,
      password: hashedPassword,
      bYear,
      bMonth,
      bDay,
      gender,
    }).save();

    const emailVerificationToken = generateToken({id: user._id.toString()}, "30m");
    const token = generateToken({id: user._id.toString()}, "1d");
    const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;

    sendVerificationEmail(user.email, user.first_name, url);

    res.send({
      id: user._id,
      username: user.username,
      picture: user.picture,
      first_name: user.first_name,
      last_name: user.last_name,
      token,
      verified: user.verified,
      message: 'User registered successfully. Please check your email to verify your account',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const activateAccount = async (req: Request, res: Response) => {
  const { token } = req.body;

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;

    if (!user || typeof user === 'string') {
      return res.status(400).json({ message: 'Invalid token' });
    }

    const check = await User.findById(user.id);
    if (check?.verified) {
      return res.status(400).json({ message: 'Account already verified' });
    }

    await User.findByIdAndUpdate(user.id, { verified: true });
    res.json({ message: 'Account verified successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: 'User does not exist' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

     if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect Password!' });
     }

    const token = generateToken({id: user._id.toString()}, "1d");

    res.send({
      id: user._id,
      username: user.username,
      picture: user.picture,
      first_name: user.first_name,
      last_name: user.last_name,
      token,
      verified: user.verified,
      message: 'User registered successfully. Please check your email to verify your account',
    });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
}

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;

    if (!decoded.id) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(decoded.id).select("-password"); // Exclude password field

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const resendVerification = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.user?.id;
    const user = await User.findById(id);

    if (user.verified) {
      return res.status(400).json({ message: 'Account already verified' });
    }

    const emailVerificationToken = generateToken({id: user._id.toString()}, "30m");
    const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;

    await sendVerificationEmail(user.email, user.first_name, url);

    res.status(200).json({ message: 'Verification email sent' });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const findUser = async (req: Request<{}, {}, ResetPasswordRequestBody>, res: Response<UserResponse | ErrorResponse>): Promise<Response> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      return res.status(400).json({
        message: "Account does not exist.",
      });
    }
    return res.status(200).json({
      email: user.email,
      picture: user.picture,
    });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const sendResetPasswordCode = async (req: Request<{}, {}, ResetPasswordRequestBody>, res: Response<ErrorResponse>): Promise<Response> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Code.findOneAndDelete({ user: user._id });

    const code = generateCode(5);

    await new Code({
      code,
      user: user._id,
    }).save();

    sendResetCode(user.email, user.first_name, code);

    return res.status(200).json({
      message: "Email reset code has been sent to your email",
    });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const validateResetCode = async (req: Request<{}, {}, ResetPasswordRequestBody>, res: Response<ErrorResponse>): Promise<Response> => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const Dbcode = await Code.findOne({ user: user._id });
    if (!Dbcode || Dbcode.code !== code) {
      return res.status(400).json({
        message: "Verification code is incorrect.",
      });
    }
    return res.status(200).json({ message: "Verification successful." });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const changePassword = async (req: Request<{}, {}, ResetPasswordRequestBody>, res: Response<ErrorResponse>): Promise<Response> => {
  try {
    const {email, password} = req.body;

    if (!password) {
      return res.status(400).json({message: "Password is required."});
    }

    const cryptedPassword = await bcrypt.hash(password, 12);
    await User.findOneAndUpdate(
        {email},
        {
          password: cryptedPassword,
        }
    );

    return res.status(200).json({message: "Password updated successfully."});
  } catch (error) {
    return res.status(500).json({message: (error as Error).message});
  }
};
