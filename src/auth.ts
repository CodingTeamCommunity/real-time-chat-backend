import { betterAuth } from "better-auth";
import { Pool, PoolConfig } from "pg";

const config: PoolConfig = {
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB_NAME,
  password: process.env.PG_PASS,
  port: parseInt(process.env.PG_PORT || "5432"),

  max: 20, // Maximum number of clients allowed in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error if a connection takes over 2 seconds
};

export const auth = betterAuth({
  database: new Pool(config),
  emailAndPassword: {
    enabled: true,
  },
});
