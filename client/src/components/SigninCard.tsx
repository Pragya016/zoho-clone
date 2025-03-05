import { useState, FormEvent, useEffect, BaseSyntheticEvent } from "react";
// import GoogleIcon from '@mui/icons-material/Google';
// import { signInWithPopup } from "firebase/auth";
// import { auth, provider } from "../config/firebase";
import { makeStyles } from "@mui/styles";
import { Alert, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../utility";
import logo from '../assets/zoho-logo.png';
import { useUser, Admin } from "../context/User";

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

const useStyles = makeStyles({
  backdrop: {
    background: 'whitesmoke',
    height: '100svh',
    width: '100svw',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }, 
  card: {
    background: 'white',
    borderRadius: '15px',
    padding: '2rem',
    width: '40vw'
  },
  logo: {
    height: '50px',
    width: '130px'
  },
  heading: {
    fontSize: '1.5rem',
    margin: '1rem 0 0 0'
  },
  text1: {
    margin: 0
  },
  form: {
    display: "flex",
    justifyContent: 'center',
    flexDirection: 'column',
    margin: '2rem 0'
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: 'grey',
    margin: '2rem 0 0 0',
    textAlign: 'center'
  },
  redirectLink: {
    cursor: 'pointer',
    color: '#F0483D'
  },
  googleIcon: {
    marginRight: '5px'
  }
});

const initialState = {email: '', password: ''};

function SignInCard(){
  const styles = useStyles();
  const [formData, setFormData] = useState<FormDataInterface>(initialState);
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const {setAdmin} = useUser();

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
        console.log(res);
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

  // async function handleGoogleLogin() {
  //   try {
  //     const result = await signInWithPopup(auth, provider);
  //     console.log("Logged in with Google!", result);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  function handleChange(e: BaseSyntheticEvent) {
    const name = e.target.name;
    const value = e.target.value;
    setFormData({...formData, [name]: value});

    if(error) {
      setError('');
    }
  }

  return (
    <div className={styles.backdrop}>
      <div className={styles.card}>
        <div>
            <img src={logo} alt="logo" className={styles.logo} />
        </div>
        <div>
          <p className={styles.heading}>Sign in</p>
          <p className={styles.text1}>to access Zoho Home</p>
        </div>
        <form onSubmit={handleEmailLogin} className={styles.form}>
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
        {/* <div className={styles.buttonContainer}>
          <Button sx={{border: '2px solid lightgrey', color: 'grey'}} onClick={handleGoogleLogin}>
            <GoogleIcon className={styles.googleIcon}/> Sign in using Google
          </Button>
        </div> */}
        <p className={styles.text}>Don't have a Zoho account? <b className={styles.redirectLink} onClick={() => navigate('/sign-up')}>Sign up now</b></p>
      </div>
    </div>
  );
};

export default SignInCard;