import { BaseSyntheticEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../utility";
import { ResponseInterface } from "./SignInCard";
import { useAdmin } from "../context/Admin";
import { Alert, Button, FormControl, FormLabel, TextField } from "@mui/material";
import styles from './css/change.password.module.css';

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
    const [error, setError] = useState<string>('');

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
 
      if(error) {
        setError('');
      }
    } 

    async function changePassword() {
      try {
        const res = await fetchData('/api/admin/change-password', 'POST', {...formData, email: admin.email});

        if(res.status === 200) {
          localStorage.removeItem('idToken');
          return navigate('/sign-in')
        }
        
        setError(res.message);
      } catch (error) {
        console.log(error);
      }
    }

    return (
      <div id={styles.backdrop}>
      <form onSubmit={handleChangePassword} id={styles.card}>
        <h1 id={styles.heading}>Change Password</h1>
        {error && <Alert severity="error">{error}</Alert>}
        <FormControl>
          <FormLabel htmlFor="old-password" className={styles.label}>Old Password*</FormLabel>
          <TextField type="password" id="old-password" variant="outlined" name="oldPassword" onChange={handleChange}/>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="new-password" className={styles.label}>New Password*</FormLabel>
          <TextField type="password" id="new-password" variant="outlined" name="newPassword" onChange={handleChange}/>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="new-password-repeated"className={styles.label}>New Password (Enter Again)*</FormLabel>
          <TextField type="password" id="new-password-repeated" variant="outlined" name="newPasswordRepeated" onChange={handleChange}/>
        </FormControl>
          <Button type="submit" variant="contained" id={styles.submitButton}>Change Password</Button>
      </form>
      </div>
    )
}