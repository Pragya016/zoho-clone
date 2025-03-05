import { Router } from "express";
import { handleFileUpload } from "../controllers/admin.controller";

const router = Router();

router.get('/upload', handleFileUpload)

export default router;