import { Request, Response } from "express";
import { User } from "../entity/User";
import { AppDataSource } from "../database/datasource";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import bcrypt from "bcrypt";
import { sendMail } from "../actions/mail.action";
config();

const userRepository = AppDataSource.getRepository(User);

export async function verifyToken(req: Request, res: Response) {
  // const idToken = req.headers.authorization?.split("Bearer ")[1];
  const { idToken } = req.query;

  if (!idToken) {
    // return res.status(401).send({ error: "Unauthorized" });
    return res.send({ error: "Unauthorized", status: 'rejected'});
  }

  try {
    // const decodedToken = await admin.auth().verifyIdToken(idToken);
    // @ts-ignore
    const decodedToken = await jwt.verify(idToken, process.env.SECRET_KEY);
    const response = {
      id: decodedToken.id,
      name: decodedToken.name,
      email: decodedToken.email,
      role: decodedToken.role,
      status: 'success'
    }
    res.status(200).send(response);
  } catch (error) {
    // return res.status(403).send({ error: "Invalid token", status: 'success' });
    return res.send({ error: "Invalid token", status: 'rejected' });
  }
}

export async function handleSignupUser(req: Request, res: Response) {
  try {
    const { name, email, password, role } = req.body;

    // Validate user input
    const result = validateInput(name, email, password);
    if (result.status === "rejected") {
      // return res.status(400).send(result);
      return res.send(result);
    }

    // Check if user with the entered email already exists in the database
    const existingUser = await userRepository
      .createQueryBuilder("users")
      .where("users.email = :email", { email })
      .getOne();

    if (existingUser) {
      // return res.status(403).json({ message: "User already exists" });
      return res.send({ message: "User already exists", status: "rejected" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user and save in the database
    const user = new User();
    user.name = name;
    user.email = email;
    user.password = hashedPassword;
    user.role = role;

    await userRepository.save(user);
    sendMail(email, name);
    return res.status(201).send({ message: "User registered successfully", status: 'success' });
  } catch (error) {
    console.error("Error signing up user:", error);
    // return res.status(500).send({ message: "Internal server error" });
    return res.send({ message: "Internal server error", status: "rejected" });
  }
}

export async function handleSigninUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // if email or password is empty string
    if (!email || !password) {
      // return res.status(400).send({ message: "Email or password is required" });
      return res.send({ message: "Email or password is required", status: 'rejected' });
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
      // return res.status(404).send({ message: "Email or password is invalid" });
      return res.send({ message: "Email or password is invalid", status: 'rejected' });
    }

    const isCorrectPassword = await bcrypt.compare(password, user?.password);

    if(!isCorrectPassword) {
      return res.send({message: 'email or password in incorrect', status: 'rejected' });
    }

    // @ts-ignore
    // create the token and send back to the client
    const token = jwt.sign({ ...user }, process.env.SECRET_KEY, {
      expiresIn: "3d",
    });

    res.status(200).send({ token, status: 'success' });
  } catch (error) {
    console.log(error);
    res.send({message: 'Internal server error', status: 'rejected'})
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
