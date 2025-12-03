// server.js
// Main Express server for WEB322 Assignment 3

const express = require("express");
const mongoose = require("mongoose");
const session = require("client-sessions");
const path = require("path");
const dotenv = require("dotenv");
const { sequelize } = require("./models"); // Sequelize instance

// Load .env
dotenv.config();

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

const app = express();

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS)
app.use(express.static(path.join(__dirname, "public")));

// Set view engine (EJS)
app.set("view engine", "ejs");

// Configure client sessions
app.use(
  session({
    cookieName: "session",
    secret: process.env.SESSION_SECRET,
    duration: 30 * 60 * 1000 // 30 minutes
  })
);

// --- Connect MongoDB (Users Collection) ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

// --- Connect PostgreSQL (Tasks Table) ---
sequelize
  .sync()
  .then(() => console.log("PostgreSQL connected"))
  .catch((err) => console.log("Postgres error:", err));

// Routes
app.use("/", authRoutes);
app.use("/", taskRoutes);

// Start Server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
