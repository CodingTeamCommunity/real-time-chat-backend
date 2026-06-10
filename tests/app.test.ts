import app from "../src/app.js";
import supertest from "supertest";
import * as test_db from "./test_db.js";
import mongoose from "mongoose";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { execSync } from "child_process";

let request = supertest(app);

let container: any;

describe("Test request with mongoose", () => {
  beforeAll(async () => {
    await test_db.connect();
    if (mongoose.connection.readyState == 1) {
      console.log("Mongoose connected to test DB");
    }
    container = await new PostgreSqlContainer("postgres:17-alpine").start();
    // process.env.PG_TEST_CONN = container.getConnectionUri();
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
