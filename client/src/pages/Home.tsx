import { useNavigate } from "react-router-dom";
import { fetchData } from "../utility";
import { lazy, Suspense, useEffect } from "react";
import SidebarMenu from "../components/Sidebar";
import { Box } from "@mui/material";
import { ResponseInterface } from "../components/SignInCard";
import { Admin, useAdmin } from "../context/Admin";
import CRMTab from "../components/CRMTab";
import { useActiveMenu } from "../context/ActiveMenu";
import Loader from "../components/Loader";

export interface AdminInterface {
  data: Admin;
}

export default function Home() {
    const navigate = useNavigate();
    const {admin,setAdmin} = useAdmin();
    const { active } = useActiveMenu();
    const PieChart = lazy(() => import("../components/PieChart"));
    const BarChart = lazy(() => import("../components/BarChart"));
    const TasksTab = lazy(() => import("../components/TasksTab"));

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
        console.error(error);
        navigate('/sign-in');
      }
    }

    return (
      <Box sx={{display: 'flex'}}>
      <SidebarMenu />
      <Box sx={{overflow: 'hidden', width:'100%'}}>
      <Suspense fallback={<Loader />}>
        {admin && admin.role === 'admin' && active.crm && <CRMTab />}
        {active.tasks && <TasksTab />}
        {admin && admin.role === 'admin' && active.pieChart && <PieChart chartType='department'/>}
        {admin && admin.role === 'admin' && active.barChart && <BarChart chartType='department'/>}
      </Suspense>
      </Box>
      </Box>
    )
}