const redis = require("./redis");

const cache = (ttlSeconds = 60) => async (req, res, next) => {
  const key = `cache:${req.originalUrl}`;

  try {
    const cached = await redis.get(key);
    if (cached) {
      res.set("X-Cache", "HIT");
      return res.status(200).json(JSON.parse(cached));
    }
  } catch (err) {
    console.error("Cache read failed:", err.message);
  }

  res.set("X-Cache", "MISS");
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode === 200) {
      redis.set(key, JSON.stringify(body), "EX", ttlSeconds).catch(() => {});
    }
    return originalJson(body);
  };

  next();
};

module.exports = cache;