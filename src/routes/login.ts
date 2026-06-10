import { Router } from "express";
import { Request, Response } from "express";
/**
 * IDP Router for the express server which handles user related functions like
 * signup, login, recovery, etc.
 *
 * @see Router
 */
const loginRouter: Router = Router();

/**
 * Un-Authorized Route: Ping the server route to check for connectivity
 */
loginRouter.get("/login", (req: Request, res: Response) => {
  res.json("login router!");
});

export default loginRouter;
