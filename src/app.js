// src/app.js
import express from "express";
import { getAllTasks, getTaskById } from "./tasks.js";

const app = express();
app.use(express.json());

let tasks = [
  { id: 1, title: "Õpi Node.js mooduleid", completed: true },
  { id: 2, title: "Ehita Express API", completed: false },
  { id: 3, title: "Kirjuta automaattestid", completed: false },
];

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

//GET /api/tasks?completed=true/false
app.get("/api/tasks", (req, res) => {
  const { completed } = req.query;

  if (completed !== undefined) {
    if (completed !== "true" && completed !== "false") {
      return res
        .status(400)
        .json({ error: "Invalid parameter value for 'completed'" });
    }

    const isCompleted = completed === "true";
    const filteredTasks = tasks.filter(
      (task) => task.completed === isCompleted,
    );
    return res.json(filteredTasks);
  }
  res.json(getAllTasks(tasks));
});

// GET /api/tasks/:id
app.get("/api/tasks/:id", (req, res) => {
  const task = getTaskById(tasks, req.params.id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.json(task);
});

// POST /api/tasks
app.post("/api/tasks", (req, res) => {
  const { title } = req.body;

  // Validation
  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "Title cannot be empty" });
  }

  const trimmedTitle = title.trim();

  // ID generation
  const maxId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) : 0;
  const newId = maxId + 1;

  // New object
  const newTask = {
    id: newId,
    title: trimmedTitle,
    completed: false,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

export default app;
