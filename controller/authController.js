const asyncHandler = require("express-async-handler");
const { OAuth2Client } = require("google-auth-library");
const User = require("../model/User");
const jwt = require("jsonwebtoken");

exports.ContinueWithGoogle = asyncHandler(async (req, res) => {
  const { credential } = req.body;
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const verify = await client.verifyIdToken({ idToken: credential });
  if (!verify) {
    return res.status(400).json({ message: "unable to verify" });
  }
  console.log(verify);
  const { email, name, picture } = verify.payload;
  const result = await User.findOne({ email });
  if (!result) {
    const userData = await User.create({ name, email, avatar: picture });
    const token = jwt.sign({ userId: userData._id }, process.env.JWT_TOKEN, {
      expiresIn: "7d",
    });
    res.cookie("auth", token, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });
    return res.json({
      message: "register success",
      result: { name, email, avatar: picture },
    });
  } else {
    const token = jwt.sign({ userId: result._id }, process.env.JWT_TOKEN, {
      expiresIn: "7d",
    });
    res.cookie("auth", token, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });
    return res.status(200).json({ message: "Login Success", result });
  }
});

exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie("auth");
  res.json({ message: "Logout success" });
});
