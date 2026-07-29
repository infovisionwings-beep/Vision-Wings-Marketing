const { Redis } = require('ioredis');

const oldRedis = new Redis("rediss://default:gQAAAAAAAaEtAAIgcDIyZjk0OTNkYmRmMDM0MDgzOTFhYzkyMmJjZDJjOWZkOA@key-hawk-106797.upstash.io:6379");
const newRedis = new Redis("rediss://default:gQAAAAAAAYHRAAIgcDJjYjQ0MzFiNjcwZDk0MGUwOGZjNmYxMWMyOWEzOGYxMA@legal-pug-98769.upstash.io:6379");

async function migrate() {
    console.log("Migrating Redis data...");
    const keys = await oldRedis.keys('*');
    if (keys.length === 0) {
        console.log("No keys found in old Redis.");
        process.exit(0);
    }
    for (const key of keys) {
        try {
            const type = await oldRedis.type(key);
            if (type === 'string') {
                const val = await oldRedis.get(key);
                const ttl = await oldRedis.ttl(key);
                if (ttl > 0) {
                    await newRedis.set(key, val, 'EX', ttl);
                } else {
                    await newRedis.set(key, val);
                }
                console.log(`Migrated string key: ${key}`);
            } else if (type === 'hash') {
                const val = await oldRedis.hgetall(key);
                const ttl = await oldRedis.ttl(key);
                await newRedis.hset(key, val);
                if (ttl > 0) await newRedis.expire(key, ttl);
                console.log(`Migrated hash key: ${key}`);
            } else if (type === 'list') {
                const val = await oldRedis.lrange(key, 0, -1);
                if (val.length > 0) {
                    await newRedis.rpush(key, ...val);
                }
                const ttl = await oldRedis.ttl(key);
                if (ttl > 0) await newRedis.expire(key, ttl);
                console.log(`Migrated list key: ${key}`);
            } else if (type === 'set') {
                const val = await oldRedis.smembers(key);
                if (val.length > 0) {
                    await newRedis.sadd(key, ...val);
                }
                const ttl = await oldRedis.ttl(key);
                if (ttl > 0) await newRedis.expire(key, ttl);
                console.log(`Migrated set key: ${key}`);
            } else {
                console.log(`Skipped key ${key} of unsupported type ${type}`);
            }
        } catch (err) {
            console.error(`Error migrating key ${key}:`, err.message);
        }
    }
    console.log("Redis migration complete.");
    process.exit(0);
}

migrate().catch(err => {
    console.error(err);
    process.exit(1);
});
