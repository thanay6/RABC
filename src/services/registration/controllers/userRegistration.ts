import { Request, Response } from "express";
import db from "../../../database/db_connection";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  userValidationSchema,
  loginValidationSchema,
} from "../validations/userValidation";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { error } = userValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        solution: error.details[0].message,
      });
    }

    const { username, email, password, role, phone_number } = req.body;

    // Check if the user already exists
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
        solution: "Change email address",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newMember = await db.User.create({
      username,
      email,
      password: hashedPassword, // Save the hashed password
      role,
      phone_number,
    });

    // Send a success response
    return res.status(201).json({
      message: "Admin registered successfully",
      user: newMember,
    });
  } catch (error) {
    // Handle errors
    return res.status(500).json({
      message: "An error occurred during registration",
      error: (error as Error).message ?? "Unknown error occurred",
    });
  }
};

export const loginUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { error } = loginValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        solution: error.details[0].message,
      });
    }

    const { email, password } = req.body;

    // Check if the user exists
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
        solution: "Check your email and password",
      });
    }

    // Check if the password matches
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
        solution: "Check your email and password",
      });
    }
    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    // Send a success response with the token
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        phone_number: user.phone_number,
      },
    });
  } catch (error) {
    // Handle errors
    return res.status(500).json({
      message: "An error occurred during login",
      error: (error as Error).message ?? "Unknown error occurred",
    });
  }
};
