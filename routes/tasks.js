// routes/tasks.js
// Protected task CRUD routes

const express = require("express");
const Task = require("../models/Task");
const { ensureLogin } = require("./middleware");
const router = express.Router();

// Dashboard
router.get("/dashboard", ensureLogin, async (req, res) => {
  const count = await Task.count({ where: { userId: req.session.user.id } });
  res.render("dashboard", { user: req.session.user, count });
});

// List tasks
router.get("/tasks", ensureLogin, async (req, res) => {
  const tasks = await Task.findAll({
    where: { userId: req.session.user.id }
  });
  res.render("tasks", { tasks });
});

// Add task form
router.get("/tasks/add", ensureLogin, (req, res) => {
  res.render("addTask");
});

// Add task submit
router.post("/tasks/add", ensureLogin, async (req, res) => {
  const { title, description, dueDate } = req.body;

  await Task.create({
    title,
    description,
    dueDate,
    userId: req.session.user.id
  });

  res.redirect("/tasks");
});

// Edit task form
router.get("/tasks/edit/:id", ensureLogin, async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  res.render("editTask", { task });
});

// Edit submit
router.post("/tasks/edit/:id", ensureLogin, async (req, res) => {
  const { title, description, dueDate, status } = req.body;

  await Task.update(
    { title, description, dueDate, status },
    { where: { id: req.params.id } }
  );

  res.redirect("/tasks");
});

// Delete task
router.post("/tasks/delete/:id", ensureLogin, async (req, res) => {
  await Task.destroy({ where: { id: req.params.id } });
  res.redirect("/tasks");
});

// Update status
router.post("/tasks/status/:id", ensureLogin, async (req, res) => {
  await Task.update(
    { status: req.body.status },
    { where: { id: req.params.id } }
  );
  res.redirect("/tasks");
});

module.exports = router;
