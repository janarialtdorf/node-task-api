import fs from "node:fs/promises";
import { loadTasks } from "./src/tasks.js";

async function runDemo() {
  const testDir = "./data/demo_test";
  await fs.mkdir(testDir, { recursive: true });

  const validFile = `${testDir}/valid.json`;
  const missingFile = `${testDir}/non_existent.json`;
  const invalidJsonFile = `${testDir}/corrupted.json`;
  const notArrayFile = `${testDir}/object.json`;

  await fs.writeFile(
    validFile,
    JSON.stringify([{ id: 1, title: "Test task", completed: false }]),
  );
  await fs.writeFile(invalidJsonFile, '{ id: 1, title: "Katkine JSON" ');
  await fs.writeFile(
    notArrayFile,
    JSON.stringify({ message: "Ei ole massiiv" }),
  );

  console.log("START DEMO");

  try {
    const tasks = await loadTasks(validFile);
    console.log("1. Kehtiv fail tagastas:", tasks);
  } catch (err) {
    console.error("1. Viga:", err.message);
  }

  try {
    const tasks = await loadTasks(missingFile);
    console.log("2. Olematu fail tagastas:", tasks);
  } catch (err) {
    console.error("2. Viga:", err.message);
  }

  try {
    await loadTasks(invalidJsonFile);
  } catch (err) {
    console.log("3. Vigane JSON viskas vea:", err.message);
  }

  try {
    await loadTasks(notArrayFile);
  } catch (err) {
    console.log("4. Mittemassiiv viskas vea:", err.message);
  }

  await fs.rm(testDir, { recursive: true, force: true });
  console.log("END DEMO");
}

runDemo();
