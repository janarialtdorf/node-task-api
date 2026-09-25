export function getAllTasks(tasks) {
  if (!Array.isArray(tasks)) return [];
  return [...tasks];
}

export function getTaskById(tasks, id) {
  if (!Array.isArray(tasks)) return undefined;
  const taskId = Number(id);
  return tasks.find((task) => task.id === taskId);
}

export function getCompletedTasks(tasks) {
  if (!Array.isArray(tasks)) return [];
  return tasks.filter((task) => task.completed === true);
}
