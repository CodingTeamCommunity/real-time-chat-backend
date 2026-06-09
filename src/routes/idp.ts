import { Router } from "express";
import { Request, Response } from "express";
/**
 * IDP Router for the express server which handles user related functions like
 * signup, login, recovery, etc.
 *
 * @see Router
 */
const idpRouter: Router = Router();

/**
 * Un-Authorized Route: Ping the server route to check for connectivity
 */
idpRouter.get("/ping", (req: Request, res: Response) => {
  res.json("IDP Main Route Ping Successful!");
});

export default idpRouter;
