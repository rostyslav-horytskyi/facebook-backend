import { Request, Response } from 'express';
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {validateEmail, validateLength, validateUsername} from "../helpers/validations";
import {generateToken} from "../helpers/tokens";
import {sendVerificationEmail} from "../helpers/mailer";

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
