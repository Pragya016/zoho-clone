import { Request, Response } from "express";
import fs from "fs";
import csv from "csv-parser";
import { AppDataSource } from "../database/datasource";
import { User } from "../entity/User";
import bcrypt from "bcrypt";

const userRepository = AppDataSource.getRepository(User);
export async function handleFileUpload(req: Request, res: Response) {
  try {
    const file = req.file;
    const { adminId } = req.query;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log(adminId, typeof adminId);
    if (!adminId || typeof adminId !== "string") {
      return res.status(400).json({ message: "Admin ID is required" });
    }

    const results: object[] = [];

    fs.createReadStream(file.path)
      .pipe(csv())
      .on("data", async (data) => {
        try {
          await saveUser(data, adminId);
          results.push(data);
        } catch (error) {
          console.error(error);
        }
      })
      .on("end", () => {
        res
          .status(201)
          .json({ message: "File processed successfully", users: results });
      })
      .on("error", (err) => {
        console.error(err);
        res.status(500).json({ message: "Error processing file" });
      });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function saveUser(data: any, adminId: string) {
  try {
    const adminIdNumber = parseInt(adminId, 10);
    if (isNaN(adminIdNumber)) {
      console.log("Invalid Admin ID");
      return;
    }

    // Check if admin exists
    const admin = await userRepository
      .createQueryBuilder("users")
      .where("users.id = :adminId", { adminId: adminIdNumber })
      .getOne();

    if (!admin) {
      console.log("Admin doesn't exist");
      return;
    }

    if (!data.email) {
      console.log("User email is missing, skipping row.");
      return;
    }

    // Check if a user with the same email exists
    const existingUser = await userRepository
      .createQueryBuilder("users")
      .where("users.email = :email", { email: data.email })
      .getOne();

    if (existingUser) {
      console.log(`User with email ${data.email} already exists, skipping.`);
      return;
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(data.password || "Abcd@1234", 10);

    // Create a new user
    const user = new User();
    user.name = data.name || "Unknown";
    user.email = data.email;
    user.password = hashedPassword;
    user.department = data.department || null;
    user.designation = data.designation || null;
    user.role = "user";

    // Save user to the database
    await userRepository.save(user);
    console.log(`User ${user.email} saved in the database`);
  } catch (error) {
    console.error("Error saving user:", error);
  }
}

export async function handleDeleteUser(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const user = await userRepository.findOneBy({
      id: +userId,
    });

    if (user) {
      await userRepository.remove(user);
      return res
        .status(200)
        .send({ message: "User deleted successfully", response: user });
    }

    res
      .status(400)
      .send({ message: "Something went wrong. Please try again later" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
}

export async function handleGetUsers(req: Request, res: Response) {
  try {
    const users = await userRepository.findBy({ role: "user" });
    const filteredUsers = users.map((user) => {
      const filteredUser = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      return filteredUser;
    });
    res.status(200).send(filteredUsers);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
}

export async function handleUpdateUser(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const data = req.body;

    // Find user by ID
    const user = await userRepository.findOneBy({ id: +userId, role: "user" });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    user.name = data.name;
    await userRepository.save(user);
    res
      .status(200)
      .send({ message: "User data updated successfully", response: user });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
}

export async function handleGetFilteredUsers(req: Request, res: Response) {
  try {
    const { q, condition } = req.query;

    // filter the data based on the condition
    const users = await userRepository
      .createQueryBuilder("users")
      .where("users.role = :role", { role: "user" })
      .getMany();

    if (!q) {
      return res.status(200).send({ data: users });
    }

    const filteredData = users.filter((user) => {
      if (q && typeof q === "string") {
        return (
          user.name.toLowerCase().includes(q) ||
          user.email.toLowerCase().includes(q)
        );
      }
      return false;
    });

    res.status(200).send({ data: filteredData });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
}
