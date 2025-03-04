import { useState, FormEvent, useEffect } from "react";
import GoogleIcon from '@mui/icons-material/Google';
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../config/firebase";
import { makeStyles } from "@mui/styles";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../utility";

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
    fontSize: '2rem'
  },
  heading: {
    fontSize: '1.5rem',
    margin: 0
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
    color: 'blue'
  },
  googleIcon: {
    marginRight: '5px'
  }
});

function SignUpCard(){
  const styles = useStyles();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('idToken');

    if(token){
      handleRedirect(token);
    }

  }, [])

  async function handleRedirect(token : string) {
    try {
      const res = await fetchData(`/api/auth?idToken=${token}`, 'GET');
      
      if(res?.status === 200) {
        navigate('/');
      }

    } catch (error) {
      console.error(error)
    }
  }

  async function handleCreateUser(e: FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      const res = await fetchData('/api/auth/new', 'POST', {name, email, password, role: 'admin'});

      if(res.status !== 200) {
        console.log('Something went wrong', res);
        return;
      }

      navigate('/sign-in');
    } catch (error: unknown) {
      console.error(error);
    }
  };

  async function handleGoogleLogin() {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Logged in with Google!", result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.card}>
        <div>
          <p className={styles.logo}>Logo</p>
        </div>
        <div>
          <p className={styles.heading}>Create new account</p>
          <p className={styles.text1}>to access Zoho Home</p>
        </div>
        <form onSubmit={handleCreateUser} className={styles.form}>
          <TextField 
            sx={{marginBottom: '0.3rem'}}
            type="name" 
            placeholder="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
          <TextField 
            sx={{marginBottom: '0.3rem'}}
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <TextField 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <Button sx={{margin: '1rem 0'}} variant="contained" type="submit">Create Account</Button>
        </form>
        <div className={styles.buttonContainer}>
          <Button sx={{border: '2px solid lightgrey', color: 'grey'}} onClick={handleGoogleLogin}>
            <GoogleIcon className={styles.googleIcon}/> Sign in using Google
          </Button>
        </div>
        <p className={styles.text}>Don't have a Zoho account? <b className={styles.redirectLink}>Sign up now</b></p>
      </div>
    </div>
  );
};

export default SignUpCard;