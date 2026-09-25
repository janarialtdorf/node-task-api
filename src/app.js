import express from "express";
import cors from "cors";
import { getAllTasks, getTaskById } from "./tasks.js";

const app = express();

app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`req.method: ${req.method}, req.url: ${req.url}`);
  next();
});

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

// PATCH /api/tasks/:id
app.patch("/api/tasks/:id", (req, res) => {
  const task = getTaskById(tasks, req.params.id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  const { title, completed } = req.body;

  // Title validation
  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({ error: "Title cannot be empty" });
    }
    task.title = title.trim();
  }

  // Completed validation
  if (completed !== undefined) {
    if (typeof completed !== "boolean") {
      return res
        .status(400)
        .json({ error: "Completed must be a boolean value (true/false)" });
    }
    task.completed = completed;
  }
  res.status(200).json(task);
});

// DELETE /api/tasks/:id
app.delete("/api/tasks/:id", (req, res) => {
  const taskIndex = tasks.findIndex((t) => t.id === Number(req.params.id));

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

// 404 Catch-all -> Käivitub ainult siis, kui ükski ülemine marsruut ei vastanud päringule
app.use((req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// 500 Error handler
app.use((err, req, res, next) => {
  console.error("Internal server error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
