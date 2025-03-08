import { Router, Request, Response } from "express";
import { handleCreateTask, handleDeleteTask, handleGetAllTasks, handleUpdateTask } from "../controllers/tasks.controller";

const router = Router();

router.route('/')
.get((req: Request, res: Response) => {
    handleGetAllTasks(req, res);
})
.post((req: Request, res: Response) => {
    handleCreateTask(req, res);
})

router.route('/:taskId')
.delete((req: Request, res: Response) => {
    handleDeleteTask(req, res);
})
.patch((req: Request, res: Response) => {
    handleUpdateTask(req, res);
})

export default router;