import { Router, Request, Response } from "express";
import { handleFileUpload } from "../controllers/admin.controller";
import { upload } from "../config/file.upload";

const router = Router();

router.post('/upload', upload.single('employees-data'), (req: Request, res: Response) => {
    handleFileUpload(req, res);
})

export default router;