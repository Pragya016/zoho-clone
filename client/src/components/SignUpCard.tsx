import { useState, FormEvent, useEffect, BaseSyntheticEvent } from "react";
import { Alert, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../utility";
import logo from "../assets/zoho-logo.png";
import { ResponseInterface } from "./SignInCard";
import styles from "./css/signup.module.css";

export interface FormDataInterface {
  name: string;
  email: string;
  password: string;
}

const initialState = { name: "", email: "", password: "" };
function SignUpCard() {
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
      if ((res as ResponseInterface).status === 201) {
        setFormData(initialState);
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
        ...formData,
        role: "admin",
      });

      if ((res as ResponseInterface).status !== 201) {
        setError((res as ResponseInterface).message);
        return;
      }

      setFormData(initialState);
      navigate("/sign-in");
    } catch (error: unknown) {
      console.error(error);
    }
  }

  function handleChange(e: BaseSyntheticEvent) {
    const name = e.target.name;
    const value = e.target.value;
    setFormData({ ...formData, [name]: value });
    if (error) {
      setError("");
    }
  }

  return (
    <div id={styles.backdrop}>
      <nav id={styles.nav}>
        <img src={logo} alt="logo" id={styles.logo} />
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
      <div id={styles.card}>
        <div>
          <h1 id={styles.heading}>
            Start with your free account today.
          </h1>
        </div>
        <form onSubmit={handleCreateUser} id={styles.form}>
          {error && (
            <Alert severity="error" sx={{ marginBottom: "1.5rem" }}>
              {error}
            </Alert>
          )}
          <label htmlFor="name" className={styles.label}>
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
          <label htmlFor="email" className={styles.label}>
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
          <label htmlFor="password" className={styles.label}>
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
      </div>
    </div>
  );
}

export default SignUpCard;
