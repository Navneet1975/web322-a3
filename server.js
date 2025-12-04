const expressLayouts = require("express-ejs-layouts");

const express = require("express");
const mongoose = require("mongoose");
const session = require("client-sessions");
const path = require("path");
const dotenv = require("dotenv");
const { sequelize } = require("./models");

// Load environment variables
dotenv.config();

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

const app = express();

// ---------------------
// Middleware
// ---------------------
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

// Sessions (works on Vercel)
app.use(
  session({
    cookieName: "session",
    secret: process.env.SESSION_SECRET,
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000
  })
);

// ---------------------
// MongoDB Connection
// ---------------------
let mongoConnected = false;
async function connectMongo() {
  if (mongoConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URI, { });
    console.log("MongoDB connected");
    mongoConnected = true;
  } catch (err) {
    console.log("MongoDB error:", err);
  }
}

// ---------------------
// PostgreSQL Connection
// ---------------------
async function connectPostgres() {
  try {
    await sequelize.sync();
    console.log("PostgreSQL connected");
  } catch (err) {
    console.log("Postgres error:", err);
  }
}

// Connect databases on first request (Serverless Safe)
app.use(async (req, res, next) => {
  await connectMongo();
  await connectPostgres();
  next();
});

// ---------------------
// Routes
// ---------------------
app.use("/", authRoutes);
app.use("/", taskRoutes);

// ---------------------
// Export for Vercel
// ---------------------
module.exports = app;

// Localhost only
if (process.env.NODE_ENV !== "production") {
  app.listen(3000, () => console.log("Server running on http://localhost:3000"));
}
