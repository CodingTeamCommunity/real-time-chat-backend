import app from "../src/app";
import supertest from "supertest";
import * as test_db from "./test_db";
import mongoose from "mongoose";

const request = supertest(app);

describe("Test request with mongoose", () => {
  beforeAll(async () => {
    await test_db.connect();
    if (mongoose.connection.readyState == 1) {
      console.log("Mongoose connected to test DB");
    }
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
