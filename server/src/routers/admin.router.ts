import { Router, Request, Response } from "express";
import { handleDeleteUser, handleFileUpload, handleGetUsers, handleUpdateUser } from "../controllers/admin.controller";
import { upload } from "../config/file.upload";

const router = Router();

router.route('/').get((req: Request, res: Response) => {
    handleGetUsers(req, res);
})

router.route('/:userId')
.delete((req: Request, res: Response) => {
    handleDeleteUser(req, res);
})
.patch((req: Request, res: Response) => {
    handleUpdateUser(req, res);
})

router.post('/upload', upload.single('employees-data'), (req: Request, res: Response) => {
    handleFileUpload(req, res);
})

export default router;