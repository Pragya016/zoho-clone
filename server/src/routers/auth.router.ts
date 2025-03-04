import { Router, Request, Response} from "express";
import { verifyToken } from "../controllers/user.controller";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  verifyToken(req, res);
});

export default router;