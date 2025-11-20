
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: any;
}

// VERIFY TOKEN

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const header = req.headers.authorization;
        console.log("Header",header)
        if (!header) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const token = header.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        console.log("Decoded Token:", decoded);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};


// ROLE AUTHORIZATION
export const authorizeRoles = (...allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized for this action"
            });
        }

        next();
    };
};
