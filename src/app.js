import express from "express";
import cors from "cors";
import { readTasks, writeTasks } from "./tasks.js";

const app = express();

app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`req.method: \({req.method}, req.url:\){req.url}`);
  next();
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// GET /api/tasks?completed=true/false
app.get("/api/tasks", async (req, res, next) => {
  try {
    const tasks = await readTasks();
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

    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

// GET /api/tasks/:id
app.get("/api/tasks/:id", async (req, res, next) => {
  try {
    const tasks = await readTasks();
    const task = tasks.find((t) => t.id === Number(req.params.id));

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
});

// POST /api/tasks
app.post("/api/tasks", async (req, res, next) => {
  try {
    const { title } = req.body;

    if (!title || typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({ error: "Title cannot be empty" });
    }

    const tasks = await readTasks();
    const maxId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) : 0;
    const newTask = {
      id: maxId + 1,
      title: title.trim(),
      completed: false,
    };

    tasks.push(newTask);
    await writeTasks(tasks);

    res.status(201).json(newTask);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/tasks/:id
app.patch("/api/tasks/:id", async (req, res, next) => {
  try {
    const tasks = await readTasks();
    const task = tasks.find((t) => t.id === Number(req.params.id));

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const { title, completed } = req.body;

    if (title !== undefined) {
      if (typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({ error: "Title cannot be empty" });
      }
      task.title = title.trim();
    }

    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        return res
          .status(400)
          .json({ error: "Completed must be a boolean value (true/false)" });
      }
      task.completed = completed;
    }

    await writeTasks(tasks);
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/tasks/:id
app.delete("/api/tasks/:id", async (req, res, next) => {
  try {
    const tasks = await readTasks();
    const taskIndex = tasks.findIndex((t) => t.id === Number(req.params.id));

    if (taskIndex === -1) {
      return res.status(404).json({ error: "Task not found" });
    }

    tasks.splice(taskIndex, 1);
    await writeTasks(tasks);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// 404 Catch-all
app.use((req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// 500 Error handler
app.use((err, req, res, next) => {
  console.error("Internal server error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
