import jwt from "jsonwebtoken";

import env from "../config/env.js";

const authMiddleware = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.json({
                status: false,
                message: "No token provided"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        return res.json({
            status: false,
            message: "Invalid token"
        });
    }
};

export default authMiddleware;