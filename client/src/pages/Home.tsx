import { useNavigate } from "react-router-dom";
import { fetchData } from "../utility";
import { useEffect } from "react";
import SidebarMenu from "../components/Sidebar";
import { Box } from "@mui/material";
import { ResponseInterface } from "../components/SignInCard";
import { User, useUser } from "../context/User";

interface UserInterface {
  data: User;
}

export default function Home() {
    const navigate = useNavigate();
    const {user, setUser} = useUser();
    console.log('user data ----', user);
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

        setUser((res as UserInterface).data)
      } catch (error) {
        console.log(error);
        navigate('/sign-in');
      }
    }
  

    return (
      <Box sx={{display: 'flex'}}>
      <SidebarMenu />
        <h1>Hello World, You're on the homepage</h1>
      </Box>
    )
}