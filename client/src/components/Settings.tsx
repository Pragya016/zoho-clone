import * as React from "react";
import Popover from "@mui/material/Popover";
import SettingsIcon from "@mui/icons-material/Settings";
import { IconButton } from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import DownloadIcon from "@mui/icons-material/Download";
import { useNavigate } from "react-router-dom";
import styles from "./css/settings.module.css";
import { useAdmin } from "../context/Admin";

export default function Settings() {
  const { admin } = useAdmin();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  function handleNavigate() {
    navigate("/change-password");
  }

  function handleDownloadSample() {
    const link = document.createElement("a");
    link.href = "../assets/mockData.csv";
    link.download = "mockData.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div>
      <IconButton onClick={handleClick}>
        <SettingsIcon />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div className={styles.menu_item} onClick={handleNavigate}>
          <KeyIcon className={styles.icon} />
          <span>Change Password</span>
        </div>
        {admin?.role === "admin" && (
          <div className={styles.menu_item} onClick={handleDownloadSample}>
            <DownloadIcon className={styles.icon} />
            <span>Download Sample</span>
          </div>
        )}
      </Popover>
    </div>
  );
}
