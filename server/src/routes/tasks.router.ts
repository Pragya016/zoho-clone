import { Router } from "express";
import { handleCreateTask, handleDeleteTask, handleGetAllTasks, handleUpdateTask } from "../controllers/tasks.controller";

const router = Router();

router.route('/')
.get(handleGetAllTasks)
.post(
    // @ts-ignore
    handleCreateTask
)

router.route('/:taskId')
.delete(
    // @ts-ignore
    handleDeleteTask
)
.patch(
    // @ts-ignore
    handleUpdateTask
)

export default router;