import { useNavigate } from "react-router-dom";
import { fetchData } from "../utility";
import { lazy, Suspense, useEffect } from "react";
import SidebarMenu from "../components/Sidebar";
import { Box } from "@mui/material";
import { ResponseInterface } from "../components/SignInCard";
import { Admin, useAdmin } from "../context/Admin";
import CRMTab from "../components/CRMTab";
import { useActiveMenu } from "../context/ActiveMenu";
import TasksTab from "../components/TasksTab";
import Loader from "../components/Loader";

interface AdminInterface {
  data: Admin;
}

export default function Home() {
    const navigate = useNavigate();
    const {setAdmin} = useAdmin();
    const { active } = useActiveMenu();
    const PieChart = lazy(() => import("../components/PieChart"))
    const BarChart = lazy(() => import("../components/BarChart"))
    const LineChart = lazy(() => import("../components/LineChart"))

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
      <Suspense fallback={<Loader />}>
        {active.crm && <CRMTab />}
        {active.tasks && <TasksTab />}
        {active.pieChart && <PieChart />}
        {active.lineChart && <LineChart />}
        {active.barChart && <BarChart />}
      </Suspense>
      </Box>
    )
}