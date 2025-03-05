import { useNavigate } from "react-router-dom";
import { fetchData } from "../utility";
import { useEffect } from "react";
import SidebarMenu from "../components/Sidebar";
import { Box } from "@mui/material";
import { ResponseInterface } from "../components/SignInCard";
import { Admin, useUser } from "../context/User";
import CRMTab from "../components/CRMTab";

interface AdminInterface {
  data: Admin;
}

export default function Home() {
    const navigate = useNavigate();
    const {setAdmin} = useUser();

    useEffect(() => {
      const token = localStorage.getItem('idToken');
      if(!token) navigate('/sign-in');
      if(token){
        checkIsAuthorised(token);
      }
  
    }, [])
  
    async function checkIsAuthorised(token : string) {
      try {
        const res = await fetchData(`/api/auth?idToken=${token}`, 'GET');

        if((res as ResponseInterface).status !== 200) {
            navigate('/sign-in');
        }

        setAdmin((res as AdminInterface).data)
      } catch (error) {
        console.log(error);
        navigate('/sign-in');
      }
    }
  

    return (
      <Box sx={{display: 'flex'}}>
      <SidebarMenu />
      <div id="content">
        <CRMTab />
      </div>
      </Box>
    )
}