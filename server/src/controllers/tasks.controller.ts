import { Request, response, Response } from "express";
import { AppDataSource } from "../database/datasource";
import { Task } from "../entity/Task";

const tasksRepository = AppDataSource.getRepository("tasks");

export async function handleGetAllTasks(req: Request, res: Response) {
    try {
        const tasks = await tasksRepository.find();
        res.status(200).send(tasks);
    } catch (error) {
        res.status(500).send({message: 'Internal server error'});
        console.log(error);
    }
}

export async function handleCreateTask(req: Request, res: Response) {
  try {
    const data = req.body;

    if (!data.description) {
      return res
        .status(400)
        .send({ message: "Task description is not defined" });
    }

    if (!data.created_by) {
      return res.status(400).send({ message: "Creator's name is required" });
    }

    const task = await new Task();
    task.description = data.description;
    task.created_by = data.created_by;
    task.assigned_by = data.assigned_by || 'Unknown';
    task.assigned_to = data.assigned_to || 'Not assigned yet';
    task.status = data.status || 'Not started';

    const response = await tasksRepository.save(task);
    res.status(201).send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
}

export async function handleDeleteTask(req: Request, res: Response) {
  try {
    const { taskId } = req.params;

    if (!taskId) {
      return res.status(400).send({ message: "taskId is required" });
    }

    if (isNaN(+taskId)) {
      return res.status(400).send({ message: "taskId is invalid" });
    }

    const task = await tasksRepository.findOneBy({ id: parseInt(taskId) });
    const taskToDelete = {...task};

    if (!taskToDelete) {
      return res.status(404).send({ message: "There is no task to delete" });
    }

    await tasksRepository.remove(taskToDelete);
    res.status(200).send(task);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
}

export async function handleUpdateTask(req: Request, res: Response) {
    try {
        const {taskId} = req.params;
        const {description, created_by, assigned_by, assigned_to, status} = req.body;

        if(!taskId) {
            return res.status(400).send({message: "taskId is required"});
        }

        if(isNaN(+taskId)) {
            return res.status(400).send({message: "taskId is invalid"});
        }

        const taskToUpdate = await tasksRepository.findOneBy({id: parseInt(taskId)});

        if(!taskToUpdate) {
            return res.status(404).send({message: "No task found to update"});
        }

        taskToUpdate.description = description || taskToUpdate.description;
        taskToUpdate.created_by = created_by || taskToUpdate.created_by;
        taskToUpdate.assigned_by = assigned_by || taskToUpdate.assigned_by;
        taskToUpdate.assigned_to = assigned_to || taskToUpdate.assigned_to;
        taskToUpdate.status = status || taskToUpdate.status;

        const task = await tasksRepository.save(taskToUpdate);
        res.status(200).send(task);
    } catch (error) {
        console.log(error);
        res.status(500).send({message: 'Internal server error'});
    }
}