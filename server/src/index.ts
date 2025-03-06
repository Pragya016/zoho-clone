import express from "express";
import admin from "firebase-admin";
import cors from 'cors';
import { AppDataSource } from "./database/datasource";
import authRouter from './routers/auth.router';
import adminRouter from './routers/admin.router';
import bodyParser from "body-parser";

const server = express();

// middlewares
server.use(express.json());
server.use(cors({
    origin: '*',
}))
server.use(bodyParser.urlencoded({
    extended: true
}));

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
server.use('/api/auth', authRouter);
server.use('/api/admin', adminRouter);

const PORT = 3001;
server.listen(PORT, () => {
    console.log('server is running on PORT ', PORT);
});