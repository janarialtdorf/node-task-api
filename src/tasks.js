import fs from "node:fs/promises";
import path from "node:path";

const tasksFilePath = process.env.TASKS_FILE || "data/tasks.json";
const filePath = path.resolve(tasksFilePath);

export async function readTasks() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      // error no entry
      await writeTasks([]);
      return [];
    }
    throw error;
  }
}

export async function writeTasks(tasks) {
  await fs.writeFile(filePath, JSON.stringify(tasks, null, 2), "utf-8");
}
