import { RedisClient } from "../../config/redis.js";
import { TooManyReqError } from "../utils/error.js";

const redis = RedisClient.getInstance()

export const rateLimiter = async (req, res, next) => {
    try {
        const key = `rate-limit:${req.ip}`;

        const requests = await redis.incr(key);

        if (requests === 1) {
            await redis.expire(key, 60); 
        }

        if (requests > 100) {
            throw new TooManyReqError("Too many requests. Please try again later.");
        }

        next();
    } catch (error) {
        next(error);
    }
};
