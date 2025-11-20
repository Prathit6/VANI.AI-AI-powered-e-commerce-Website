import express from "express";
const router = express.Router();
import db from "../db/index.js";
import { usersTable } from "../db/schema.js";
import {ensureAuthentication,restrictToUser} from '../middleware/auth.middleware.js';

const adminRestrictMiddleware = restrictToUser('ADMIN');
// router.use(ensureAuthenticated);
// router.use (adminRestrictMiddleware);//means all the routes in there can use this middlwares without importing in the function


router.get("/users",ensureAuthentication,adminRestrictMiddleware, async (req, res) => {
  
  const users = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
    })
    .from(usersTable); //that basically means select all the users but not password
  return res.json({ users });
});
//this is for admin want to see all the user avilable to the db
export default router;
