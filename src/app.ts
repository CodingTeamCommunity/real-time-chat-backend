// Import required libraries and constants
import express, { Request, Response, Application } from "express";
import { IDP_ROUTE_ROOT } from "./constants.js";
import idpRouter from "./routes/idp.js";
import { configDotenv } from "dotenv";
import cors from "cors";
import connectDb from "./db_conn.js";
import { auth } from "./auth.js";
import { toNodeHandler } from "better-auth/node";
import { verifyUserEmail, sendVerificationToken } from "./verification.js";


// Configure .env file if present into the process of the execution
configDotenv();

// Create the express server application
const app: Application = express();

// Initialize database connection
if (process.env.NODE_ENV != "test") {
  connectDb();
}

app.all("/api/auth/{*any}", toNodeHandler(auth));

// Configure the express server to allow for cors and set dedicated origin
app.use(
  cors({
    credentials: true,
    origin:
      process.env.STAGE === "prod"
        ? process.env.PROD_HOST
        : "http://localhost:3000",
  }),
);

// Configure express app to include json parser
app.use(express.json());

// Add server routes from ./routes directory
app.use(IDP_ROUTE_ROOT, idpRouter);

// Un-Authorized Route: General server ping for checking health of server
app.get("/", (req: Request, res: Response) => {
  res.json("Hello from Node.js, Express, and TypeScript!");
});

app.get("/verify", async (req, res) => {
  try {
      const token = req.query.token as string;

      await verifyUserEmail(token);

      res.send("Email verified!");
  } catch (error) {
      res.status(400).send("Invalid or expired token");
  }
});



app.get("/email", async (req, res) => {
  
  try {
      await sendVerificationToken(process.env.TEST_EMAIL!);// must fix when we get domain. resends test version only allow for email being sent to your personal email

      res.json({ success: true });
  } catch (err) {
      res.status(500).json({ error: err });
  }
});
// Export server app so that this app can be used in tests
export default app;
