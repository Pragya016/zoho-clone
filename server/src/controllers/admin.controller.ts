import { Request, Response } from "express";
import fs from "fs";
import csv from "csv-parser";
import { AppDataSource } from "../database/datasource";
import { User } from "../entity/User";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import { config } from "dotenv";
config();

const userRepository = AppDataSource.getRepository(User);

// ------------ handle file upload ---------------
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


// ------------ Save uploaded file's data in the database ---------------
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

    if (!data.address) {
      console.log("User address is missing, skipping row.");
      return;
    }

    if (!data.phone) {
      console.log("User contact number is missing, skipping row.");
      return;
    }

    if (!data.date_of_joining) {
      console.log("User date of joining is missing, skipping row.");
      return;
    }

    if (!data.date_of_birth) {
      console.log("User date of birth is missing, skipping row.");
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
    const hashedPassword = await bcrypt.hash(data.password || process.env.RANDOM_PASSWORD, 10);
    const uid = uuidv4();

    // Create a new user
    const user = new User();
    user.name = data.name || "Unknown";
    user.email = data.email;
    user.password = hashedPassword;
    user.department = data.department;
    user.designation = data.designation;
    user.date_of_joining = data.date_of_joining;
    user.date_of_leaving = data.date_of_leaving || null;
    user.date_of_birth = data.date_of_birth || null;
    user.address = data.address;
    user.phone = data.phone;
    user.uid = uid;
    user.role = "user";

    // Save user to the database
    await userRepository.save(user);
    console.log(`User ${user.email} saved in the database`);
  } catch (error) {
    console.error("Error saving user:", error);
  }
}

// ------------ handle delete one user ---------------
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


// ------------ handle fetch all users ---------------
export async function handleGetUsers(req: Request, res: Response) {
  try {
    const users = await userRepository.findBy({ role: "user" });

    if(users.length > 0) {
      const filteredUsers = users.map((user) => {
        const filteredUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          designation: user.designation,
          department: user.department,
          address: user.address,
          phone: user.phone,
        };
  
        return filteredUser;
      });
      return res.status(200).send(filteredUsers);
    }

    res.status(204).send({message: 'There are no users in the database'});
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
}

// ------------ handle update user details ---------------
export async function handleUpdateUser(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const data = req.body;

    // Find user by ID
    const user = await userRepository.findOneBy({ id: +userId, role: "user" });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    user.name = data.name || user.name;
    user.email = data.email || user.email;
    user.password = user.password;
    user.date_of_birth = user.date_of_birth;
    user.date_of_joining = user.date_of_joining;
    user.date_of_leaving = user.date_of_leaving;
    user.address = data.address || user.address;
    user.phone = data.phone || user.phone;
    user.department = data.department || user.department;
    user.designation = data.designation || user.designation;
    user.uid = user.uid;
    user.role = user.role;

    const updatedUser = await userRepository.save(user);
    const response = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      address: updatedUser.address,
      phone: updatedUser.phone,
      designation: updatedUser.designation,
      department: updatedUser.department,
    };

    res
      .status(200)
      .send({ message: "User data updated successfully", response });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
}

// ------------ handle filter users based on the condition ---------------
export async function handleGetFilteredUsers(req: Request, res: Response) {
  try {
    const { q, type } = req.query;
    if (!type) {
      return res.status(400).send({ message: "Please specify the query type" });
    }

    const queryBuilder = userRepository
      .createQueryBuilder("users")
      .where("users.role = :role", { role: "user" });

      if (q && typeof q === "string") {
        const queryValue = q.toLowerCase();
      
        if (type === "equals") {
          queryBuilder.andWhere(
            "(LOWER(users.name) = :q OR LOWER(users.email) = :q OR LOWER(users.designation) = :q OR LOWER(users.department) = :q OR LOWER(users.phone) = :q OR LOWER(users.address) = :q)",
            { q: queryValue }
          );
        } else if (type === "contains") {
          queryBuilder.andWhere(
            "(LOWER(users.name) LIKE :q OR LOWER(users.email) LIKE :q OR LOWER(users.designation) LIKE :q OR LOWER(users.department) LIKE :q OR LOWER(users.phone) LIKE :q OR LOWER(users.address) LIKE :q)",
            { q: `%${queryValue}%` }
          );
        } else if (type === "less-than") {
          const idValue = parseInt(q);
          if (isNaN(idValue)) {
            return res
              .status(400)
              .send({ message: "Invalid value for less-than query" });
          }
          queryBuilder.andWhere("users.id < :id", { id: idValue });
        } else if (type === "greater-than") {
          const idValue = parseInt(q);
          if (isNaN(idValue)) {
            return res
              .status(400)
              .send({ message: "Invalid value for greater-than query" });
          }
          queryBuilder.andWhere("users.id > :id", { id: idValue });
        } else {
          return res.status(400).send({ message: "Invalid query type" });
        }
      }
  
      const users = await queryBuilder.getMany();
      const filteredUsers = users.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        phone: user.phone,
        department: user.department,
        designation: user.designation,
      };
    });

    res.status(200).send({ data: filteredUsers });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
}

// ------------ handle get data to display chart ---------------
export async function handleGetChartData(req: Request, res: Response) {
  try {
    const {type} = req.query;

    if(!type) {
      return res.status(400).send({message: 'A type field of coloumn name is required in query'});
    }

    const data = await userRepository
      .createQueryBuilder('users')
      .select(`users.${type}`)
      .addSelect('COUNT(users.id)', 'userCount') 
      .groupBy(`users.${type}`)
      .getRawMany();

    console.log(data)
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
}
