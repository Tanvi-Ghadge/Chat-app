import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    httpOnly: process.env.NODE_ENV === "production", // Prevent XSS attacks in production
    sameSite: "none", // Prevent CSRF but allow cross-origin auth
    secure: process.env.NODE_ENV === "production", // Enable only in HTTPS
    path: "/", // Ensure it's available across the whole site
  });

  return token;
};
