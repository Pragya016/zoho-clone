import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { config } from 'dotenv';
config();

export function authenticate (req: Request, res: Response, next: NextFunction){
    const token = req.headers.authorization?.split(' ')[1];

    // Check if token exists
    if (!token) {
        return res.status(401).send({ message: 'Access Denied. No token provided.' });
    }

    try {
        // @ts-ignore
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET_KEY);
        if(!decoded) {
            return res.status(401).send({message: "Invalid Token"});
        }

        next();
    } catch (error) {
        console.log(error);
        res.status(401).send({ message: 'Invalid Token' });
    }
};