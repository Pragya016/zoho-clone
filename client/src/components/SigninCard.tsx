import { useState, FormEvent, useEffect, BaseSyntheticEvent } from "react";
import { Alert, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../utility";
import logo from '../assets/zoho-logo.png';
import { useAdmin, Admin } from "../context/Admin";
import styles from './css/signin.module.css';

interface FormDataInterface {
  email: string;
  password: string
}

export interface ResponseInterface {
  token: string;
  message: string;
  status: number;
  data: {
    [key: string]: string;
  }
}

interface AdminInterface {
  data: Admin;
}

const initialState = {email: '', password: ''};

function SignInCard(){
  const [formData, setFormData] = useState<FormDataInterface>(initialState);
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const {setAdmin} = useAdmin();

  useEffect(() => {
    const token = localStorage.getItem('idToken');

    if(token){
      handleRedirect(token);
    }

  }, [])

  async function handleRedirect(token : string) {
    try {
      const res = await fetchData(`/api/auth?idToken=${token}`, 'GET');
      if((res as ResponseInterface).status === 200) {
        setAdmin((res as AdminInterface).data);
        navigate('/');
      }

    } catch (error) {
      console.error(error)
    }
  }

  async function handleEmailLogin(e: FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      const res = await fetchData('/api/auth', 'POST', formData)

      if(res && (res as ResponseInterface).status !== 200) {
        setError((res as ResponseInterface).message);
        setFormData(initialState);
        return;
      }

      localStorage.setItem('idToken', (res as ResponseInterface).data.token);
      setFormData(initialState);
      navigate('/');
    } catch (error: unknown) {
      console.error(error);
    }
  };

  function handleChange(e: BaseSyntheticEvent) {
    const name = e.target.name;
    const value = e.target.value;
    setFormData({...formData, [name]: value});

    if(error) {
      setError('');
    }
  }

  return (
    <div id={styles.backdrop}>
      <div id={styles.card}>
        <div>
            <img src={logo} alt="logo" id={styles.logo} />
        </div>
        <div>
          <p id={styles.heading}>Sign in</p>
          <p id={styles.text1}>to access Zoho Home</p>
        </div>
        <form onSubmit={handleEmailLogin} id={styles.form}>
        {error && <Alert severity="error">{error}</Alert>}
        <label htmlFor="email" style={{color: 'grey'}}>Email</label>
          <TextField 
            sx={{marginBottom: '0.3rem'}}
            id="email"
            type="email" 
            name="email"
            value={formData.email} 
            onChange={handleChange}
            required 
          />
          <label htmlFor="password" style={{marginTop: '1rem', color:'grey'}}>Password</label>
          <TextField
            id="password"
            type="password"  
            name="password"
            value={formData.password} 
            onChange={handleChange}
            required 
          />
          <Button sx={{margin: '1rem 0', background: '#F0483D', fontWeight: 600}} variant="contained" type="submit">Sign in</Button>
        </form>
        <p id={styles.text}>Don't have a Zoho account? <b id={styles.redirectLink} onClick={() => navigate('/sign-up')}>Sign up now</b></p>
      </div>
    </div>
  );
};

export default SignInCard;