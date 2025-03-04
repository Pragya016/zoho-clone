import pg from 'pg';
import { config } from 'dotenv';
import { createUsersTable } from './tables.init.js';
config();

let db;
async function connectToPostgres() {
    try {
        db = new pg.Pool({
            connectionString: process.env.DB_CONNECTION_STRING
        });

        createUsersTable();
        console.log('Connected to the database.');
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
};

export default connectToPostgres;
export { db };
