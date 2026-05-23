import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { IUser } from "../models/user.model.ts";

// Represent the exact shape of your signed JWT payload
export interface UserJwtPayload extends JwtPayload {
    user: IUser;
}

export interface AuthenticatedRequest extends Request {
    user?: IUser;
}

export const isAuthenticated = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        // 1. Unified 401 response for missing/malformed headers
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "Unauthorized: Missing or malformed token" });
            return;
        }

        const token = authHeader.split(" ")[1];
        const jwtSecret = process.env.PRIVATE_KEY; // Renamed for architectural clarity

        // 2. Strict runtime check for environmental variables
        if (!jwtSecret) {
            console.error("Critical Configuration Error: JWT_SECRET is not defined.");
            res.status(500).json({ message: "Internal server error" });
            return;
        }

        // 3. Verify and safely cast to your known payload shape
        const decoded = jwt.verify(token, jwtSecret) as UserJwtPayload;

        if (!decoded || !decoded.user) {
            res.status(401).json({ message: "Unauthorized: Invalid token payload" });
            return;
        }

        // 4. Attach user data and forward to the next middleware context
        req.user = decoded.user;
        next();

    } catch (error: any) {
        // Handle specific JWT expiration or malformation cleanly
        console.error(`JWT Verification Error: ${error.message}`);

        const responseMessage = error.name === "TokenExpiredError"
            ? "Unauthorized: Token has expired"
            : "Unauthorized: Access denied";

        res.status(401).json({ message: responseMessage });
    }
};