const { redisClient } = require("../../configs/redisCon");
const redisSet = async (key, value, expiry = 300) => {
  return await redisClient.set(key, JSON.stringify(value), {
    EX: expiry,
  });
};

const redisGet = async (key) => {
  const data = await redisClient.get(key);

  return data ? JSON.parse(data) : null;
};

const redisDelete = async (key) => {
  return await redisClient.del(key);
};

const redisExists = async (key) => {
  return await redisClient.exists(key);
};

const redisExpire = async (key, seconds) => {
  return await redisClient.expire(key, seconds);
};

module.exports = {
  redisSet,
  redisGet,
  redisDelete,
  redisExists,
  redisExpire
};