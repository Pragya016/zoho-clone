import { db } from "./db.config.js";

export async function createUsersTable() {
    try {
        const query = `CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR NOT NULL,
            email VARCHAR UNIQUE NOT NULL,
            photo VARCHAR NOT NULL
        );`;
        await db.query(query);
    } catch (error) {
        console.error(error);
    }
}