import express from "express";
// import admin from "firebase-admin";
import cors from 'cors';
import { AppDataSource } from "./database/datasource";
import authRouter from './routes/auth.router';
import adminRouter from './routes/admin.router';
import tasksRouter from './routes/tasks.router';
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

// initialize database
AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err: Error) => {
        console.log("Error during Data Source initialization", err);
    });


// API routes
server.use('/api/auth', authRouter);
server.use('/api/admin', adminRouter);
server.use('/api/tasks', tasksRouter);

const PORT = 3001;
server.listen(PORT, () => {
    console.log('server is running on PORT ', PORT);
});