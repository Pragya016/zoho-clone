import { Request, Response } from "express";
import fs from "fs";
import csv from "csv-parser";
import { AppDataSource } from "../database/datasource";
import { User } from "../entity/User";
import bcrypt from 'bcrypt';

const userRepository = AppDataSource.getRepository(User);
export async function handleFileUpload(req: Request, res: Response) {
    try {
        const file = req.file;
        const {id} = req.query;
        console.log(id)

        if (!file) {
            return res.status(400).send({ message: "No file uploaded" });
        }

        const results: object[] = [];

        fs.createReadStream(file.path)
            .pipe(csv())
            .on("data", (data) => {
                saveUser(data, id ? +id : null);
                results.push(data);
            })
            .on("end", async () => {
                try {
                    res.status(201).send(results);
                } catch (dbError) {
                    res.status(500).send({ message: "Error saving data" });
                }
            })
            .on("error", (err) => {
                res.status(500).send({ message: "Error processing file" });
            });
    } catch (e) {
        res.status(500).send({ message: "Internal Server Error"});
    }
}

export async function handleDeleteUser(req: Request, res: Response) {
    try {
        const {userId} = req.params;
        const user = await userRepository.findOneBy({
            id: +userId,
        })

        if(user) {
            await userRepository.remove(user);
            return res.status(200).send({message: 'User deleted successfully', response: user});
        }

        res.status(400).send({message: 'Something went wrong. Please try again later'})
    } catch (error) {
        console.log(error);
        res.status(500).send({message: "Internal server error"});
    }
}

export async function handleGetUsers(req: Request, res: Response) {
    try {
        const {adminId} = req.query;
        if(adminId){
            const users = await userRepository.findBy({adminId: +adminId });
            const filteredUsers = users.map(user => {
                const filteredUser = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                }

                return filteredUser;
            })
            res.status(200).send(filteredUsers);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({message: "Internal server error"});
    }
}


export async function handleUpdateUser(req: Request, res: Response) {
    try {
        const { userId } = req.params;
        const data = req.body;

        // Find user by ID
        const user = await userRepository.findOneBy({ id: +userId, role: 'user' });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        user.name = data.name;
        await userRepository.save(user);
        res.status(200).send({ message: 'User data updated successfully', response: user });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error' });
    }
}

async function saveUser(data: any, adminId: number | null) {
    try {
        console.log('admin id', adminId, data);

        // Check if a user with the same email exists, but with a different adminId
        const existingUser = await userRepository.createQueryBuilder('users')
            .where('users.email = :email', { email: data.email })
            .andWhere('users.adminId = :adminId', { adminId })
            .getOne();

        if (existingUser) {
            console.log('User with the same email and a different adminId already exists');
            return;
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(data.password || 'Abcd@1234', 10);

        // Create a new user
        const user = new User();
        user.name = data.name;
        user.email = data.email;
        user.password = hashedPassword;
        user.role = 'user';
        user.adminId = adminId;

        // Save user to the database
        await userRepository.save(user);
        console.log('User saved in the database');
    } catch (error) {
        console.log('Error saving user:', error);
    }
}