const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {validateEmail, validateLength, validateUsername} = require("../helpers/validations");
const {generateToken} = require("../helpers/tokens");
const {sendVerificationEmail} = require("../helpers/mailer");

exports.register = async (req, res) => {
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

  console.log(req.body.first_name)

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

exports.activateAccount = async (req, res) => {
  const { token } = req.body;
  const user = jwt.verify(token, process.env.JWT_SECRET);
  const check = await User.findById(user.id);

  if (check.verified) {
    return res.status(400).json({ message: 'Account already verified' });
  }

  await User.findByIdAndUpdate(user.id, { verified: true });

  res.json({ message: 'Account verified successfully' });
}

exports.login = async (req, res) => {
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
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
