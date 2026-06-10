import Redis from "ioredis"


export class RedisClient {
    static instance;
    static isConnected = false;

    constructor() {
    }

    static getInstance() {
        if(!RedisClient.instance){
            RedisClient.instance = new Redis(process.env.REDIS_URL , {
                retryStrategy: (times) => {
                    const delay = Math.min(times * 50, 2000);
                    return delay;
                },
                maxRetriesPerRequest: 5,
            });
            RedisClient.setupEventListeners();
        }
        return RedisClient.instance;
    }
    static setupEventListeners() {
        RedisClient.instance.on("connect", () => {
            console.log("Connected to Redis");
            RedisClient.isConnected = true;
        });
        RedisClient.instance.on("error", (err) => {
            console.error("Redis error:", err);
            RedisClient.isConnected = false;
        });
        RedisClient.instance.on("end", () => {
            console.log("Redis connection closed");
            RedisClient.isConnected = false;
        });
        RedisClient.instance.on("reconnecting", () => {
            console.log("Reconnecting to Redis");
        });
    }
}
