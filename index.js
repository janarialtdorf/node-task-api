import { getAllTasks, getTaskById, getCompletedTasks } from "./src/tasks.js";

const tasks = [
  { id: 1, title: "Õpi Node.js mooduleid", completed: true },
  { id: 2, title: "Ehita Express API", completed: false },
  { id: 3, title: "Kirjuta automaattestid", completed: false },
];

console.log(" Kõik ülesanded ");
console.log(getAllTasks(tasks));

console.log("\n Ülesanne ID-ga 2 ");
console.log(getTaskById(tasks, 2));

console.log("\n Ülesanne olematu ID-ga (99) ");
console.log(getTaskById(tasks, 99));

console.log("\n Tehtud ülesanded ");
console.log(getCompletedTasks(tasks));

console.log("\n Test tühja massiiviga ");
console.log(getAllTasks([]));
