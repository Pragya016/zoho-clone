import { useState, FormEvent } from "react";
import GoogleIcon from '@mui/icons-material/Google';
import { signInWithEmailAndPassword, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { auth, provider } from "../config/firebase";
import { makeStyles } from "@mui/styles";
import { Button, TextField } from "@mui/material";

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

function AuthCard(): JSX.Element {
  const styles = useStyles();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  async function handleEmailLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(email, password);
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
          <p className={styles.heading}>Sign in</p>
          <p className={styles.text1}>to access Zoho Home</p>
        </div>
        <form onSubmit={handleEmailLogin} className={styles.form}>
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

export default AuthCard;
