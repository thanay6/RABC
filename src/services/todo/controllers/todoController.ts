import { Request, Response } from "express";
import db from "../../../database/db_connection";

export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title, description, email } = req.body;
    if (!req.user) {
      res.status(400).json({ message: "user not found" });
      return;
    }
    const userId = req.user.id as number;
    // Find user by email
    const member = await db.User.findOne({ where: { email } });
    if (!member) {
      return res.status(404).json({
        message: "User not found",
        solution: "Check the email address",
      });
    }
    console.log(req.user.role, "  ", member.role);

    if (req.user.role == "admin" && member.role != "user") {
      return res.status(404).json({
        message: "admin is not able to give task to guest",
        solution: "Provide task to user",
      });
    }
    if (req.user.role == "user" && member.role != "guest") {
      return res.status(404).json({
        message: "uaer is not able to give task to admin",
        solution: "Provide task to user",
      });
    }

    const createdTodo = await db.Todo.create({
      title,
      description,
      completed: false,
      userId: member.id,
      providerId: userId,
    });

    // Send success response
    return res.status(201).json({
      message: "TODO task created successfully",
      todo: createdTodo,
    });
  } catch (error) {
    // Handle errors
    return res.status(500).json({
      message: "An error occurred while creating the TODO task",
      error: (error as Error).message ?? "Unknown error occurred",
    });
  }
};
