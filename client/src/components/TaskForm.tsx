import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import {
  Box,
  CircularProgress,
  DialogTitle,
  FormControl,
  FormLabel,
  TextField,
} from "@mui/material";
import { fetchData } from "../utility";
import { useAdmin } from "../context/Admin";
import { useDispatch } from "react-redux";
import { createTask } from "../store/slices/task.slice";
import styles from "./css/task.form.module.css";
import Loader from "./Loader";

const initialState = {
  description: "",
  assignTo: "",
};

interface FormDataInterface {
  [key: string] : string
}

export default function TaskForm() {
  const [open, setOpen] = React.useState<boolean>(false);
  const [formData, setFormData] = React.useState<FormDataInterface>(initialState);
  const [error, setError] = React.useState<string>('');
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const { admin } = useAdmin();
  const dispatch = useDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function saveTask() {
    try {
      setIsSaving(true);
      const res = await fetchData("/api/tasks", "POST", {
        description: formData.description,
        assigned_to: formData.assignTo,
        created_by: admin?.email,
      });

      if (res.status === 201) {
        dispatch(createTask(res.data));
      }
    } catch (error) {
      console.log(error);
    }
    finally {
      setIsSaving(false);
    }
  }

  function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    // create task by calling the API
    saveTask();
    setOpen(false);
  }

  function handleChange(e: React.BaseSyntheticEvent) {
    const name = e.target.name;
    const value = e.target.value;
    setFormData({ ...formData, [name]: value });
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        margin: "2rem auto",
        width: '90%',
      }}
    >
      <Button variant="outlined" onClick={handleClickOpen}>
        Create Task
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Create a new task</DialogTitle>
        {!isSaving && <DialogContent sx={{width: '30svw'}}>
          <form onSubmit={handleCreateTask} id={styles.form}>
          <FormControl>
              <FormLabel htmlFor="assign-to" sx={{margin: '1rem 0 0.5rem 0'}}>Assign to</FormLabel>
              <TextField
                variant="outlined"
                type="text"
                name="assignTo"
                id="assign-to"
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="description" sx={{margin: '1rem 0 0.5rem 0'}}>Task Description*</FormLabel>
              <TextField
                variant="outlined"
                type="text"
                name="description"
                id="description"
                onChange={handleChange}
                rows={4}
                multiline
              />
            </FormControl>
          </form>
        </DialogContent>}
        {isSaving && <div id={styles.loaderContainer}>
          <CircularProgress/>
        </div>}
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" onClick={handleCreateTask} autoFocus>
            Create Task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
