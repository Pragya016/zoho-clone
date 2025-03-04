import { Button } from "@mui/material";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { useNavigate } from "react-router-dom";
import LogoutModal from "./LogoutAlertDialogue";

export default function SidebarMenu() {
  const navigate = useNavigate();

  function handleLogoutUser() {
    localStorage.removeItem('idToken');    
    navigate('/sign-in');
  }  

  return (
    <Sidebar style={{height: '100svh'}}>
        <Menu>
        <h1 style={{textAlign: 'center'}}>Zoho</h1>
      <hr />
        <MenuItem> Dashboard </MenuItem>
        <MenuItem> Tasks Management </MenuItem>
        <MenuItem> Customer Relationship Management </MenuItem>
        <SubMenu label="Reports and Analytics">
          <MenuItem> Pie charts </MenuItem>
          <MenuItem> Line charts </MenuItem>
        </SubMenu>
      </Menu>
        <div style={{position: 'absolute', bottom: 0, width: '100%'}}>
            <hr />
            <LogoutModal onLogout={handleLogoutUser}/>
        </div>
    </Sidebar>
  );
}