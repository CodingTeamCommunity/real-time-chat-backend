import app from "../src/app.js";
import supertest from "supertest";
import * as test_db from "./test_db.js";
import mongoose from "mongoose";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { execSync } from "child_process";
import {
  describe,
  test,
  expect,
  beforeAll,
  afterEach,
  afterAll,
} from "@jest/globals";
import { auth } from "../src/auth.js";
import { TestHelpers } from "better-auth/plugins";
import TestAgent from "supertest/lib/agent.js";

let request: TestAgent;

let container: StartedPostgreSqlContainer;

let authTest: TestHelpers;

describe("Test request with mongoose", () => {
  beforeAll(async () => {
    await test_db.connect();
    if (mongoose.connection.readyState == 1) {
      console.log("Mongoose connected to test DB");
    }
    container = await new PostgreSqlContainer("postgres:17-alpine").start();
    process.env.PG_TEST_CONN = container.getConnectionUri();
    const authTestCtx = await auth.$context;
    authTest = authTestCtx.test;
    request = supertest(app);
  });
  afterEach(async () => {
    await test_db.clear();
  });
  afterAll(async () => {
    await test_db.close();
  });

  test("GET - /", async () => {
    const res = await request.get("/").send();
    const body = res.body;
    expect(res.statusCode).toBe(200);
    expect(body).toBe("Hello from Node.js, Express, and TypeScript!");
  });
});
