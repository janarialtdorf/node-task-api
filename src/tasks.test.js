// src/tasks.test.js
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { loadTasks, writeTasks } from "./tasks.js";

test("salvestamine ja laadimine ajutise failiga", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "task-api-test-"));
  const tempFilePath = path.join(tempDir, "test-tasks.json");

  const sampleTasks = [
    { id: 1, title: "Esimene ajutine ülesanne", completed: false },
    { id: 2, title: "Teine ajutine ülesanne", completed: true },
  ];

  try {
    await writeTasks(sampleTasks, tempFilePath);

    const loadedTasks = await loadTasks(tempFilePath);

    assert.deepStrictEqual(loadedTasks, sampleTasks);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});
