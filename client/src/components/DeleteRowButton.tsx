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

interface Props {
  data: [{ [key: string]: string }];
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
    deleteUser(data.id);
    setOpen(false);
  };

  async function deleteUser(id: number) {
    try {
      const { data } = await fetchData(`/api/admin/${id}`, "DELETE");
      dispatch(deleteEmployee(data.response));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <React.Fragment>
      <Button
        onClick={handleClickOpen}
        startIcon={<DeleteIcon />}
        sx={{ color: "grey" }}
      >
        Delete
      </Button>
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
    </React.Fragment>
  );
}
