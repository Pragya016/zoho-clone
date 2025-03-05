import { Router, Request, Response} from "express";
import { handleSigninUser, handleSignupUser, verifyToken } from "../controllers/auth.controller";

const router = Router();

// to verify token
router.get("/", (req: Request, res: Response) => {
  verifyToken(req, res);
});

// for sign in 
router.post('/', (req: Request, res: Response) => {
  handleSigninUser(req, res);
})

// to create new user
router.post('/new', (req: Request, res: Response) => {
  handleSignupUser(req, res);
})

export default router;