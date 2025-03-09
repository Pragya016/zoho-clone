import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { FormControl, FormLabel, TextField } from "@mui/material";
import { fetchData } from "../utility";
import { useAdmin } from "../context/Admin";
import { useDispatch } from "react-redux";
import { createTask } from "../store/slices/task.slice";

const initialState = {
  description: "",
  assignTo: "",
};

export default function TaskForm() {
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState(initialState);
  const {admin} = useAdmin();
  const dispatch = useDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function saveTask() {
    try {
        const res = await fetchData('/api/tasks', 'POST', {
            description: formData.description,
            assigned_to: formData.assignTo,
            created_by: admin?.email
        })

        if(res.status === 201) {
            dispatch(createTask(res.data));
        }

    } catch (error) {
        console.log(error);
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
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Create Task
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {/* <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle> */}
        <DialogContent>
          <form onSubmit={handleCreateTask}>
            <FormControl>
              <FormLabel htmlFor="description">Desc*</FormLabel>
              <TextField
                variant="filled"
                type="text"
                placeholder="Description"
                name="description"
                id="description"
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="assign-to">Assign to</FormLabel>
              <TextField
                variant="filled"
                type="text"
                placeholder="Assign to"
                name="assignTo"
                id="assign-to"
                onChange={handleChange}
              />
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button type="submit" onClick={handleCreateTask} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
