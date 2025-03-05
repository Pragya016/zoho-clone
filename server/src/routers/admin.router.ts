import { Router, Request, Response } from "express";
import { handleFileUpload } from "../controllers/auth.controllers";
import { upload } from "../config/file.upload";

const router = Router();

router.route('/').post((req: Request, res: Response) => {
    
})

router.post('/upload', upload.single('employees-data'), (req: Request, res: Response) => {
    handleFileUpload(req, res);
})

export default router;