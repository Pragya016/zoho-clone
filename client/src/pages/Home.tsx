import { useNavigate } from "react-router-dom";
import { fetchData } from "../utility";
import { useEffect } from "react";

export default function Home() {
    const navigate = useNavigate();
  
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
  
        if(res?.status !== 200) {
            navigate('/sign-in');
        }
  
      } catch (error) {
        console.log(error);
        navigate('/sign-in');
      }
    }
  

    return (
        <h1>Hello World, You're on the homepage</h1>
    )
}