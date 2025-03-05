import { Request, Response } from "express";
import fs from "fs";
import csv from "csv-parser";
import { Employee } from "../entity/Employee";
import { AppDataSource } from "../database/datasource";
import { User } from "../entity/User";
import bcrypt from 'bcrypt';

const userRepository = AppDataSource.getRepository(User);
export async function handleFileUpload(req: Request, res: Response) {
    try {
        const file = req.file;
        const {id} = req.query;

        if (!file) {
            return res.status(400).send({ message: "No file uploaded" });
        }

        const results: Employee[] = [];

        fs.createReadStream(file.path)
            .pipe(csv())
            .on("data", (data) => {
                // if(!data.name || !data.email || !data.position ){
                //     throw new Error("name, email or position field is missing");
                // }

                saveUser(data, id ? +id : null);
                results.push(data);
            })
            .on("end", async () => {
                try {
                    console.log(results);
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
            return res.status(200).send({message: 'User deleted successfully', data: user});
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

async function saveUser(data: any, adminId: number | null) {
    try{
        const hashedPassword = await bcrypt.hash(data.password || 'Abcd@1234', 10);
        const user = new User();
        user.name = data.name;
        user.email = data.email;
        user.password = hashedPassword;
        user.role = 'user';
        user.adminId = adminId;

        await userRepository.save(user);
        console.log('user saved in the databse');
    }catch(error) {
        // console.log(error);
    }
}