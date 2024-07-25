import express, { Router, Request, Response } from "express";
import { createTodo } from "../controllers/todoController";
import { verifyUser } from "../../../middlewares/verifyAdmin";

const router: Router = express.Router();

router.post("/create-todo", verifyUser, createTodo);

export default router;
