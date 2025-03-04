import { useState, FormEvent, useEffect, BaseSyntheticEvent } from "react";
// import GoogleIcon from "@mui/icons-material/Google";
// import { signInWithPopup } from "firebase/auth";
// import { auth, provider } from "../config/firebase";
import { makeStyles } from "@mui/styles";
import { Alert, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../utility";
import logo from "../assets/zoho-logo.png";

export interface FormDataInterface {
  name: string,
  email: string,
  password: string
}

const useStyles = makeStyles({
  backdrop: {
    background: "white",
    height: "100svh",
    width: "100svw",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    borderRadius: "15px",
    padding: "2rem",
    width: "40vw",
  },
  logo: {
    height: "50px",
    width: "130px",
    marginLeft: "2rem",
  },
  heading: {
    margin: "1rem 0 0 0",
    textAlign: "center",
  },
  text1: {
    margin: 0,
  },
  form: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    margin: "2rem 0",
  },
  buttonContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "grey",
    margin: "2rem 0 0 0",
    textAlign: "center",
  },
  redirectLink: {
    cursor: "pointer",
    color: "blue",
  },
  googleIcon: {
    marginRight: "5px",
  },
  nav: {
    position: "absolute",
    top: 0,
    width: "100svw",
    margin: "auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    borderBottom: "1px solid lightgrey",
  },
});

const initialState = {name: '', email: '', password: ''};
function SignUpCard() {
  const styles = useStyles();
  const [formData, setFormData] = useState<FormDataInterface>(initialState);
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("idToken");

    if (token) {
      handleRedirect(token);
    }
  }, []);

  async function handleRedirect(token: string) {
    try {
      const res = await fetchData(`/api/auth?idToken=${token}`, "GET");

      if (res?.status === 200) {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleCreateUser(e: FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      const res = await fetchData("/api/auth/new", "POST", {
        ...formData, role: 'admin'
      });

      if (res && res.data.status === 'rejected') {
        setError(res.data.message)
        return;
      }

      setFormData(initialState)
      navigate("/sign-in");
    } catch (error: unknown) {
      console.error(error);
    }
  }

  function handleChange(e: BaseSyntheticEvent) {
    console.log(e.target.value, e.target.name);
    const name = e.target.name;
    const value = e.target.value;
    setFormData({...formData, [name]: value});
    if(error) {
      setError('');
    }
  } 

  // async function handleGoogleLogin() {
  //   try {
  //     const result = await signInWithPopup(auth, provider);
  //     console.log("Logged in with Google!", result);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  return (
    <div className={styles.backdrop}>
      <nav className={styles.nav}>
        <img src={logo} alt="logo" className={styles.logo} />
        <div>
          Already have a Zoho account?
          <Button
            sx={{ marginRight: "2rem", color: "#F0483D" }}
            onClick={() => navigate("/sign-in")}
          >
            Sign in
          </Button>
        </div>
      </nav>
      <div className={styles.card}>
        <div>
          <h1 className={styles.heading}>
            Start with your free account today.
          </h1>
        </div>
        <form onSubmit={handleCreateUser} className={styles.form}>
          {error && <Alert severity="error" sx={{marginBottom: '1.5rem'}}>{error}</Alert>}
          <label htmlFor="name" style={{ color: "grey" }}>
            Name
          </label>
          <TextField
            sx={{ marginBottom: "1rem" }}
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label htmlFor="email" style={{ color: "grey" }}>
            Email
          </label>
          <TextField
            sx={{ marginBottom: "1rem" }}
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="password" style={{ color: "grey" }}>
            Password
          </label>
          <TextField
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button
            sx={{ margin: "1rem 0", background: "#F0483D", fontWeight: 600 }}
            variant="contained"
            type="submit"
          >
            SIGN UP FOR FREE
          </Button>
        </form>
        {/* <div className={styles.buttonContainer}>
          <Button sx={{border: '2px solid lightgrey', color: 'grey'}} onClick={handleGoogleLogin}>
            <GoogleIcon className={styles.googleIcon}/> Sign in using Google
          </Button>
        </div> */}
      </div>
    </div>
  );
}

export default SignUpCard;
