import { Request, Response } from "express";
import { User } from "../entity/User";
import { AppDataSource } from "../database/datasource";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import bcrypt from "bcrypt";
import { sendMail } from "../actions/mail.action";
import { v4 as uuidv4 } from 'uuid';
config();

const userRepository = AppDataSource.getRepository(User);

export async function verifyToken(req: Request, res: Response) {
  const { idToken } = req.query;
  if (!idToken) {
    return res.status(400).send({ message: "Access denied. No token provided" });
  }

  try {
    // @ts-ignore
    const decodedToken = await jwt.verify(idToken, process.env.SECRET_KEY);
    const response = {
      id: decodedToken.id,
      name: decodedToken.name,
      email: decodedToken.email,
      role: decodedToken.role,
      status: 'success'
    }
    
    if(!decodedToken) {
      return res.status(400).send({message: 'Invalid token'});
    }

    res.status(200).send(response);
  } catch (error) {
    console.log(error)
    return res.status(403).send({ message: "The token is not valid" });
  }
}

export async function handleSignupUser(req: Request, res: Response) {
  try {
    const { name, email, password, role } = req.body;
    // Validate user input
    const result = validateInput(name, email, password);
    if (result.status === "rejected") {
      return res.status(400).send(result);
    }

    // Check if user with the entered email already exists in the database
    const existingUser = await userRepository
      .createQueryBuilder("users")
      .where("users.email = :email", { email })
      .getOne();

    if (existingUser) {
      return res.status(403).send({ message: "User already exists" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const uid = uuidv4();

    // Create a new user and save in the database
    const user = new User();
    user.name = name;
    user.email = email;
    user.password = hashedPassword;
    user.role = role || 'admin';
    user.uid = uid;

    await userRepository.save(user);
    sendMail(email, name);
    return res.status(201).send({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
}

export async function handleSigninUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // if email or password is empty string
    if (!email || !password) {
      return res.status(400).send({ message: "Email or password is required" });
    }


    // check if user with the email exists in the database
    const user = await userRepository
      .createQueryBuilder("users")
      .where(`(users.email = :email)`, {
        email,
      })
      .getOne();

    if (!user) {
      // we could also return the response 'User not found'. However it may increase the risk of leaking any private information
      return res.status(404).send({ message: "Email or password is invalid" });
    }

    const isCorrectPassword = await bcrypt.compare(password, user?.password);

    if(!isCorrectPassword) {
      return res.status(401).send({message: 'email or password in incorrect'});
    }

    // @ts-ignore
    // create the token and send back to the client
    const token = jwt.sign({ ...user }, process.env.SECRET_KEY, {
      expiresIn: "3d",
    });

    res.status(200).send({ token });
  } catch (error) {
    console.log(error);
    res.status(500).send({message: 'Internal server error'})
  }
}

function validateInput(name: string, email: string, password: string) {
  if (!name) {
    return { message: "Name is required", status: "rejected" };
  }

  if (!email) {
    return { message: "Email is required", status: "rejected" };
  }

  const emailRegExp = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
  if (!emailRegExp.test(email)) {
    return { message: "Invalid email format", status: "rejected" };
  }

  if (!password) {
    return { message: "Password is required", status: "rejected" };
  }

  const passwordRegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&]).{8,}$/;

  if (!passwordRegExp.test(password)) {
    return {
      message:
        "Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character.",
      status: "rejected",
    };
  }

  return { status: "success" };
}
