import { IconButton } from "@mui/material";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {ActiveInterface} from '../context/ActiveMenu';
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
import { useActiveMenu } from "../context/ActiveMenu";

export default function SidebarMenu() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const { admin } = useAdmin();
  const { active, setActive } = useActiveMenu();

  function handleLogoutUser() {
    localStorage.removeItem("idToken");
    navigate("/sign-in");
  }

  function handleClick(e: BaseSyntheticEvent) {
    const targetElement = e.target.closest('.menu-item');
    const menuTextContent = targetElement.textContent;

    if (!targetElement) return;

    setActive((prevState: ActiveInterface) => ({
      ...prevState,
      crm: menuTextContent === 'Customer Relationship Management',
      tasks: menuTextContent === 'Tasks Management',
      pieChart: targetElement.firstChild.lastChild.textContent === 'Pie Chart',
      lineChart: targetElement.firstChild.lastChild.textContent === 'Line Chart',
      barChart: targetElement.firstChild.lastChild.textContent === 'Bar Chart',
    }));
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
          <div
            style={{ opacity: isCollapsed ? "0" : "1" }}
            id={styles.userDetails}
          >
            <h1 id={styles.username}>{admin?.name || "Admin"}</h1>
            <p id={styles.userEmail}>
              <b>{admin?.email || "admin@example.com"}</b>
            </p>
            <p id={styles.text}>Logged in as {admin?.role}</p>
          </div>
        </div>
        <MenuItem
          icon={<PeopleIcon />}
          className='menu-item'
          onClick={handleClick}
        >
          Customer Relationship Management
        </MenuItem>
        <SubMenu
          label="Reports and Analytics"
          icon={<BarChartIcon />}
        >
          <MenuItem icon={<PieChartIcon />} className='menu-item' onClick={handleClick}>Pie Chart</MenuItem>
          {/* <MenuItem icon={<ShowChartIcon />} className='menu-item' onClick={handleClick}>Line Chart</MenuItem> */}
          <MenuItem icon={<BarChartIcon />} className='menu-item' onClick={handleClick}>Bar Chart</MenuItem>
        </SubMenu>
        <MenuItem
          onClick={handleClick}
          icon={<PlaylistAddCheckIcon />}
          className={`menu-item ${active.tasks ? styles.activeItem : ""}`}
          style={active.tasks ? active : {}}
        >
          Tasks Management
        </MenuItem>
      </Menu>

      <div id={styles.logoutButtonContainer}>
        <LogoutModal isCollapsed={isCollapsed} onLogout={handleLogoutUser} />
      </div>
    </Sidebar>
  );
}
