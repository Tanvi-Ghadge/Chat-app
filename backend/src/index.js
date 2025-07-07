import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

const allowedOrigins = [
  "https://chat-app-vert-sigma.vercel.app", // your deployed frontend
  "http://localhost:5173",                       // dev
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed for origin: " + origin));
      }
    },
    credentials: true,
  })
);

// Handle preflight requests
app.options("*", cors());

app.use(cookieParser());
app.use(express.json({ limit: "20mb" }));  
app.use(express.urlencoded({ limit: "20mb", extended: true }));  


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.get("/api/ping", (req, res) => {
  res.send("uptime");
});
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});