import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import LogoutIcon from '@mui/icons-material/Logout';

interface Props {
  onLogout: () => void;
  isCollapsed: boolean
}

export default function LogoutAlertDialog({ onLogout, isCollapsed }: Props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  }

  const handleLogout = () => {
    onLogout();
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button onClick={handleClickOpen} startIcon={<LogoutIcon />} sx={{color: '#f0483d', fontWeight: 600}}>
        <span style={{fontSize: isCollapsed ? '0.6rem' : '1rem', transition: '0.3s'}}>Logout</span>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleLogout} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
