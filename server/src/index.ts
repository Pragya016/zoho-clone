import express from "express";
import admin from "firebase-admin";
import cors from 'cors';
import { AppDataSource } from "./database/datasource";
import authRouter from './routers/auth.router';

const server = express();
server.use(express.json());
server.use(cors({
    origin: '*',
}))

// initialize firebase admin
admin.initializeApp({
    credential: admin.credential.cert("./service.account.keys.json"),
});

// initialize database
AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err: Error) => {
        console.error("Error during Data Source initialization", err);
    });


// API routes
server.get('/api/auth', authRouter);

server.listen(3000, () => {
    console.log('server is running');
});