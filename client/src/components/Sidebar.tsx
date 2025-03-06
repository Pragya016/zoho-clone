import { IconButton } from "@mui/material";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { useNavigate } from "react-router-dom";
import LogoutModal from "./LogoutAlertDialogue";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import logo from "../assets/zoho-logo.png";
import { BaseSyntheticEvent, useState } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import userImage from "../assets/default-user-icon.jpg";
import styles from "./css/sidebar.module.css";
import { useAdmin } from "../context/Admin";

// TODO: Change styles for the selected column
interface Active {
  [type: string]: boolean;
}

const initialState = { tasks: false, crm: false, analytics: false };

export default function SidebarMenu() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<Active>(initialState);
  const { admin } = useAdmin();

  function handleLogoutUser() {
    localStorage.removeItem("idToken");
    navigate("/sign-in");
  }

  function handleClick(e: BaseSyntheticEvent) {
    console.log(e);
    setIsActive({ ...isActive });
  }

  return (
    <Sidebar id={styles.sidebar} width="350px" collapsed={isCollapsed}>
      <Menu>
        <div id={styles.topContainer}>
          <IconButton
            onClick={() => setIsCollapsed((prevState) => !prevState)}
            id={styles.collapseButton}
          >
            {isCollapsed ? <ArrowForwardIosIcon /> : <ArrowBackIosNewIcon />}
          </IconButton>
          <img
            src={logo}
            alt="logo"
            id={styles.logo}
            style={{ opacity: isCollapsed ? "0" : "1" }}
          />
        </div>
        <div id={styles.userContainer}>
          <img src={userImage} alt="user-image" id={styles.userProfile} />
          {/* {!isCollapsed && ( */}
            <div style={{ opacity: isCollapsed ? "0" : "1" , transition: '0.3s'}}>
              <h1 id={styles.username}>{admin?.name || "Admin"}</h1>
              <p id={styles.userEmail}>
                <b>{admin?.email || "admin@example.com"}</b>
              </p>
              <p id={styles.text}>Logged in as {admin?.role}</p>
            </div>
          {/* )} */}
        </div>
        <MenuItem
          id="tasks"
          onClick={handleClick}
          icon={<PlaylistAddCheckIcon />}
          style={{ background: isActive.tasks ? "lightgrey" : "inherit" }}
        >
          Tasks Management{" "}
        </MenuItem>
        <MenuItem
          onClick={handleClick}
          style={{ background: isActive.tasks ? "lightgrey" : "inherit" }}
          icon={<PeopleIcon />}
        >
          {" "}
          Customer Relationship Management{" "}
        </MenuItem>
        <SubMenu
          onClick={handleClick}
          style={{ background: isActive.tasks ? "lightgrey" : "inherit" }}
          label="Reports and Analytics"
          icon={<BarChartIcon />}
        >
          <MenuItem icon={<PieChartIcon />}> Pie chart </MenuItem>
          <MenuItem icon={<ShowChartIcon />}> Line chart </MenuItem>
          <MenuItem icon={<BarChartIcon />}> Bar chart </MenuItem>
        </SubMenu>
      </Menu>
      <div id={styles.logoutButtonContainer}>
        <LogoutModal isCollapsed={isCollapsed} onLogout={handleLogoutUser} />
      </div>
    </Sidebar>
  );
}
