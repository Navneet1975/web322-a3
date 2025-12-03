// routes/auth.js
// Login, Register, Logout routes

const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();

// GET register page
router.get("/register", (req, res) => {
  res.render("register", { error: null });
});

// POST register form
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.render("register", { error: "Email already registered." });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    await User.create({
      username,
      email,
      password: hashed
    });

    res.redirect("/login");
  } catch (err) {
    res.render("register", { error: "Registration failed." });
  }
});

// GET login page
router.get("/login", (req, res) => {
  res.render("login", { error: null });
});

// POST login form
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.render("login", { error: "Invalid email or password." });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.render("login", { error: "Invalid email or password." });

  // Start session
  req.session.user = {
    id: user._id.toString(),
    username: user.username,
    email: user.email
  };

  res.redirect("/dashboard");
});

// GET logout
router.get("/logout", (req, res) => {
  req.session.reset();
  res.redirect("/login");
});

module.exports = router;
