import mongoose from "mongoose";
import User from "../models/user.model.ts";
import type { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import type { AuthenticatedRequest } from "../middlewares/Auth.ts";
const PRIVATE_KEY = process.env.PRIVATE_KEY || 'ee131faf-f326-4271-8ad8-203705362877' as string;
export const getUsers = async (req: Request, res: Response) => {
    try {
        // Changed variable names from 'products' to 'users'
        const users = await User.find({});
        if (users.length === 0)
            res.status(404).json({ "message": "No User Found!" });
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const user = await User.create(req.body);

        return res.status(201).json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error(error);

        return res.status(400).json({
            success: false,
            message: "Failed to create user",
            error,
        });
    };
}
export const updateUser = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            id,
            req.body,
            {
                returnDocument: "after",
                runValidators: true,
            }
        ).select("-password");

        // User not found
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Success response
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
        });

    } catch (error: any) {
        console.error("Update User Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // 1. Validation check
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide your email and password" });
        }

        // 2. Query the user AND explicitly select the hidden password field
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // 3. Use the schema instance method to safely verify the hashed password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '7d' });

        // 4. Secure the response payload
        // Convert document to clean JSON object and remove the password field manually before response
        const userResponse = user.toObject();
        delete userResponse.password;

        // TODO: Generate and append your JWT session token here

        res.status(200).json({
            message: "Login successful",
            user: userResponse,
            token

        });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const myProfile: RequestHandler = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const user = req.user;

        // Fail-safe check: Ensure middleware successfully populated the user object
        if (!user) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: User profile context not found"
            });
            return;
        }

        // Return the authenticated user profile data
        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error: any) {
        console.error(`Error in myProfile controller: ${error.message}`);

        // Always return a response to prevent hanging connections
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};