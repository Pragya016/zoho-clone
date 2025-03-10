import { BaseSyntheticEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../utility";
import { ResponseInterface } from "./SignInCard";
import { useAdmin } from "../context/Admin";
import { Button, FormControl, FormLabel, TextField } from "@mui/material";

interface FormDataInterface {
  [key: string]: string;
}

const initialState = {
  oldPassword: '',
  newPassword: '',
  newPasswordRepeated: ''
}

export default function ChangePasswordCard() {
    const navigate = useNavigate();
    const {admin} = useAdmin();
    const [formData, setFormData] = useState<FormDataInterface>(initialState);

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
        } catch (error) {
          console.error(error);
          navigate('/sign-in');
        }
      }

    function handleChangePassword(e: FormEvent) {
      e.preventDefault();
      changePassword();
    }

    function handleChange(e: BaseSyntheticEvent) {
      const name = e.target.name;
      const value = e.target.value;
      setFormData({...formData, [name]: value});
    } 

    async function changePassword() {
      try {
        const res = await fetchData('/api/admin/change-password', 'POST', {...formData, email: admin.email});

        if(res.status === 200) {
          localStorage.removeItem('idToken');
          navigate('/sign-in')
        }

      } catch (error) {
        console.log(error);
      }
    }

    return (
      <form onSubmit={handleChangePassword}>
        <FormControl>
          <FormLabel htmlFor="old-password">Old Password*</FormLabel>
          <TextField id="old-password" variant="outlined" name="oldPassword" onChange={handleChange}/>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="new-password">New Password*</FormLabel>
          <TextField id="new-password" variant="outlined" name="newPassword" onChange={handleChange}/>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="new-password-repeated">New Password (Enter Again)*</FormLabel>
          <TextField id="new-password-repeated" variant="outlined" name="newPasswordRepeated" onChange={handleChange}/>
        </FormControl>
          <Button type="submit" variant="contained">Change Password</Button>
      </form>
    )
}