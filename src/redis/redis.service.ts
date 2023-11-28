import { ConfigService } from '@nestjs/config';
// redis.service.ts

import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { allUserMap } from 'src/events/message';
let yn = false;
@Injectable()
export class RedisService {
  private readonly redisClient: Redis;
  private readonly subRedisClient: Redis;

  constructor(protected configService: ConfigService) {
    this.redisClient = new Redis({
      host: configService.get('REDIS_HOST'), // Redis 服务器的主机名
      port: configService.get('REDIS_PORT'), // Redis 服务器的端口
      password: configService.get('REDIS_PASSWORD'),
    });
    this.subRedisClient = new Redis({
      host: configService.get('REDIS_HOST'), // Redis 服务器的主机名
      port: configService.get('REDIS_PORT'), // Redis 服务器的端口
      password: configService.get('REDIS_PASSWORD'),
    });
    if (!yn) {
      this.subscribe();
    }
    yn = true;
  }

  subscribe() {
    this.subRedisClient.config('SET', 'notify-keyspace-events', 'Ex');
    this.subRedisClient.subscribe('__keyevent@0__:expired');
    this.subRedisClient.on('message', async (channel, message) => {
      const res: Object = await this.hGetAll(`${message}-copy`);
      console.log('键值过期了', message);
      console.log(res);
      let key = Object.keys(res)[0];
      // 删除对应键
      await this.hDel(`${message}-copy`, key);
      // 加入消息提醒
      const { messageToUserId } = JSON.parse(res[key]);
      const ws = allUserMap.get(String(messageToUserId));
      if (ws) {
        ws.emit('sendMessageServer', res[key]);
      }
    });
  }

  async hSet(key, hashkey, hashval, timeNumber?: number) {
    // if (timeNumber && timeNumber < 0) {
    //   return;
    // }
    if (typeof hashval === 'object') {
      hashval = JSON.stringify(hashval);
    }
    await this.redisClient.hmset(key, hashkey, hashval);
    // 赋值值，用于过期是获取
    await this.redisClient.hmset(`${key}-copy`, hashkey, hashval);
    // 设置过期时间
    if (timeNumber) {
      await this.redisClient.expire(key, timeNumber);
    }
  }
  async hGetAll(key) {
    const promise = new Promise((resolve, reject) => {
      this.redisClient.hgetall(key, function (err, val) {
        if (err) {
          reject(err);
          return;
        }
        if (val == null) {
          resolve(null);
          return;
        }
        resolve(val);
      });
    });
    return promise;
  }
  async hDel(key, hashkey) {
    await this.redisClient.hdel(key, hashkey);
  }
}
