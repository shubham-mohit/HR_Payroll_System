import jwt from "jsonwebtoken";
import {prisma} from "../lib/prisma.js";
import { UnauthorizedError, ForbiddenError } from "../utils/error.js";
import { AccessRole } from "../enum/index.js"

export const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken;


        if (!token) {
            throw new UnauthorizedError("Authentication required.")
        }

        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                throw new UnauthorizedError(
                    "Session expired. Please login again."
                );
            }

            throw new UnauthorizedError(
                "Invalid authentication token."
            );
        }

        const user = await prisma.employee.findUnique({
            where: {
                id: decoded.id,
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                isDeleted: true,
                jobTitle: true
            },
        });

        if (!user) {
            throw new UnauthorizedError("User not found.");
        }

        if (user.isDeleted) {
            throw new ForbiddenError("Account has been deactivated.");
        }

        if(user.jobTitle !== AccessRole.HR_MANAGER){
            throw new ForbiddenError('You are not authorized to perform this operation.')
        }

        req.user = {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            // role: user.role
        };

        next();
    } catch (error) {
        next(error);
    }
};
