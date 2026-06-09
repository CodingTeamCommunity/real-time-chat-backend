import { Server } from "http";
import app from "../src/app";
import request from "supertest";
import TestAgent from "supertest/lib/agent";

// Variable for holding the server which will be tested
let server: Server | null = null;

// Variable for holding the request agent that will send requests to the server
let myRequest: InstanceType<typeof TestAgent> | null = null;

// Before All Tests: Load the express server and request agent
beforeAll((done) => {
  server = app.listen(done);
  myRequest = request.agent(server);
  done();
});

// After All Tests: Close down the express server
afterAll((done) => {
  server?.close(done);
  done();
});

describe("GET /", () => {
  it("Should return 200", (done) => {
    myRequest
      ?.get("/")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toBe("Hello from Node.js, Express, and TypeScript!");
        return done();
      });
  });
});
