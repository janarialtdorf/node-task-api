import fs from "node:fs/promises";
import path from "node:path";

const defaultFilePath = process.env.TASKS_FILE || "data/tasks.json";

export async function loadTasks(filePath = defaultFilePath) {
  const resolvedPath = path.resolve(filePath);

  try {
    const data = await fs.readFile(resolvedPath, "utf-8");

    let tasks;
    try {
      tasks = JSON.parse(data);
    } catch (parseError) {
      throw new Error(
        `Andmefail sisaldab vigast JSON-i: ${parseError.message}`,
      );
    }

    if (!Array.isArray(tasks)) {
      throw new Error("Andmefaili sisu peab olema massiiv.");
    }

    return tasks;
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

export async function readTasks() {
  return loadTasks();
}

export async function writeTasks(tasks) {
  const resolvedPath = path.resolve(defaultFilePath);
  await fs.writeFile(resolvedPath, JSON.stringify(tasks, null, 2), "utf-8");
}
