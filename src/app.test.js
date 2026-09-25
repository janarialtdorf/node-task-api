import { test, describe } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "./app.js";

describe("Task Tracker API automated tests", () => {
  // Test 1: health api
  test("GET /api/health", async () => {
    const response = await request(app).get("/api/health");

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, { status: "ok" });
  });

  // Test 2: GET tasks
  test("GET /api/tasks", async () => {
    const response = await request(app).get("/api/tasks");

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(response.body));
  });

  // Test 3: GET unknown tasks
  test("GET /api/tasks/9999", async () => {
    const response = await request(app).get("/api/tasks/9999");

    assert.equal(response.status, 404);
    assert.equal(response.body.error, "Task not found");
  });

  // Test 4: POST tasks
  test("POST /api/tasks", async () => {
    const newTask = { title: "Testime automaatselt" };

    const response = await request(app)
      .post("/api/tasks")
      .send(newTask)
      .set("Content-Type", "application/json");

    assert.equal(response.status, 201);
    assert.equal(response.body.title, "Testime automaatselt");
    assert.equal(response.body.completed, false);
    assert.ok(typeof response.body.id === "number");
  });

  // Test 5: POST invalid tasks
  test("POST /api/tasks", async () => {
    const invalidTask = { title: "   " };

    const response = await request(app)
      .post("/api/tasks")
      .send(invalidTask)
      .set("Content-Type", "application/json");

    assert.equal(response.status, 400);
    assert.ok(response.body.error);
  });

  // Test 6: unknown endpoint
  test("GET /api/unknown", async () => {
    const response = await request(app).get("/api/unknown");

    assert.equal(response.status, 404);
    assert.equal(response.body.error, "API endpoint not found");
  });
});
