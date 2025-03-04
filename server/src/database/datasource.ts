import { DataSource } from "typeorm";
import { config } from "dotenv";
import path from "path";
config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT) || 5432,
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    synchronize: true,
    ssl: {
        rejectUnauthorized: false
    },
    entities:[path.join(__dirname, "../entity/*{.ts,.js}")], 
    // logging: true,
});