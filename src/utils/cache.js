import { RedisClient } from "../../config/redis.js";

const CACHE_PREFIX = 'insights:country:';
const TTL = 300;

const redis = RedisClient.getInstance();

function buildKey(country) {
  return `${CACHE_PREFIX}${country.toLowerCase().trim()}`;
}

export async function get(country) {
  try {
    const data = await redis.get(buildKey(country));
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('[Redis] get failed:', err.message);
    return null;
  }
}

export async function set(country, value) {
  try {
    await redis.set(buildKey(country), JSON.stringify(value), 'EX', TTL);
  } catch (err) {
    console.error('[Redis] set failed:', err.message);
  }
}

export async function invalidate(country) {
  try {
    await redis.del(buildKey(country));
    console.log(`[Redis] invalidated: ${buildKey(country)}`);
  } catch (err) {
    console.error('[Redis] invalidate failed:', err.message);
  }
}
