import redisClient from "../../configs/redisCon";

export const redisSet = async (key, value, expiry = 300) => {
  return await redisClient.set(key, JSON.stringify(value), {
    EX: expiry,
  });
};

export const redisGet = async (key) => {
  const data = await redisClient.get(key);

  return data ? JSON.parse(data) : null;
};

export const redisDelete = async (key) => {
  return await redisClient.del(key);
};

export const redisExists = async (key) => {
  return await redisClient.exists(key);
};

export const redisExpire = async (key, seconds) => {
  return await redisClient.expire(key, seconds);
};