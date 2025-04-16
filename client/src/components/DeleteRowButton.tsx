import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";
import { fetchData } from "../utility";
import { deleteEmployee } from "../store/slices/employee.slice";
import { IconButton } from "@mui/material";
import { AxiosResponse } from "axios";
import { toast, ToastContainer } from "react-toastify";

interface Props {
  data: DataInterface;
}

export interface DataInterface {
  [key: string | number]: string;
}

export default function DeleteRowButton({ data }: Props) {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    deleteUser(+data.id);
    setOpen(false);
  };

  async function deleteUser(id: number) {
    try {
      const token = localStorage.getItem('idToken');

      if(!token) {
        toast.error('Something went wrong');
        return;
      }

      const res = await fetchData(`/api/admin/${id}`, "DELETE", null, token);

      if(res.status !== 200) {
        toast.error("Something went wrong. Couldn't delete user");
        return;
      }

      dispatch(deleteEmployee((res as AxiosResponse).data.response));
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
            Are you sure you want to delete this user? This action can't be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      {/* <ToastContainer closeOnClick={true}/> */}
    </React.Fragment>
  );
}
