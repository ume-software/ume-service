import { config } from "@/configs";
import { RedisClientType, createClient } from "redis";
export const REDIS_PREFIX = {
    USER: "USER",
};
export class RedisService {
    private client: RedisClientType;

    constructor() {
        this.client = createClient({
            url: this.getRedisUrl()
        });

        this.client.on("error", (err: any) =>
            console.log("Redis Client Error", err)
        );
    }

    private getRedisUrl(): string {
        const { username, password, host, port } = config.redis;
        let url = `redis://`;

        if (username && password) {
            url += `${username}:${password}@`;
        }

        url += `${host}:${port}`;
        return url;
    }

    public async connect(): Promise<void> {
        try {
            return await this.client.connect();
        } catch (e) {}
    }

    public async set(
        key: string,
        value: string,
        options = {
            secondsExpire: 3600,
        }
    ): Promise<string | null> {
        const result = await this.client.set(key, value);
        if (options.secondsExpire)
            this.client.expire(key, options.secondsExpire);
        return result;
    }

    public async get(key: string): Promise<string | null> {
        return await this.client.get(key);
    }

    public async disconnect(): Promise<void> {
        try {
            return await this.client.disconnect();
        } catch (e) {}
    }

    public async quit(): Promise<string> {
        return await this.client.quit();
    }
}
