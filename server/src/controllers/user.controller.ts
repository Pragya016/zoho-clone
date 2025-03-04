import { Request, Response } from "express";
import admin from "firebase-admin";

export async function verifyToken(req: Request, res: Response) {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    res.status(200).send(decodedToken);
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
}
