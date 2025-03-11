import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";
import { fetchData } from "../utility";
import { deleteTask } from "../store/slices/task.slice";
import { IconButton } from "@mui/material";
import {  AxiosResponse } from "axios";

interface Props {
  taskId: string
}

export default function DeleteTaskButton({ taskId }: Props) {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    removeTask(taskId);
    setOpen(false);
  };

  async function removeTask(id: string) {
    try {
      const response = await fetchData(`/api/tasks/${id}`, "DELETE");
      dispatch(deleteTask((response as AxiosResponse).data.id));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <React.Fragment>
      <IconButton
        onClick={handleClickOpen}
      >
        <DeleteIcon sx={{color: '#c90202'}}/>
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this Task?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
