import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp, db } from "../../../firebaseConfig";
import { setDoc, doc } from "firebase/firestore";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
    console.log(userCredentials);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let res = await signUp(userCredentials);
    if (res.user.uid) {
      await setDoc(doc(db, "users", res.user.uid), { rol: "user" });
    }
    if (res.status !== 400) {
      navigate("/login");
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "#222427",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zoom: 0.8,
        }}
      >
        <div>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Link
              to="/login"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img
                src="https://firebasestorage.googleapis.com/v0/b/mayoristakaurymdp.appspot.com/o/ATLANTICS.DEV.png?alt=media&token=756b01e2-fd6c-479f-bff3-d27e1c19e503"
                alt="Atlantic Devs Logo"
                style={{ maxWidth: "300px" }}
              />
            </Link>
          </div>
          <Typography
            style={{
              fontFamily: '"Poppins", sans-serif',
              margin: "1rem",
              color: "white",
            }}
            variant="h6"
            noWrap
            component="div"
          >
            Payment Service Provider
          </Typography>
        </div>
        <form onSubmit={handleSubmit}>
          <Grid container rowSpacing={2} justifyContent={"center"}>
            <Grid item xs={10} md={12}>
              <TextField
                onChange={handleChange}
                name="email"
                label="Email"
                fullWidth
                InputProps={{
                  style: { fontFamily: "Poppins", color: "white" },
                }}
                InputLabelProps={{
                  style: { fontFamily: "Poppins", color: "white" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white",
                    },
                    "&:hover fieldset": {
                      borderColor: "lightgray",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "lightgray",
                    },
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                  "& .MuiInputBase-input": {
                    color: "white",
                  },
                }}
              />
            </Grid>
            <Grid item xs={10} md={12}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel
                  htmlFor="outlined-adornment-password"
                  style={{ fontFamily: "Poppins", color: "white" }}
                >
                  Contraseña
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOff style={{ color: "white" }} />
                        ) : (
                          <Visibility style={{ color: "white" }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Contraseña"
                  inputProps={{
                    style: { fontFamily: "Poppins", color: "white" },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "white",
                      },
                      "&:hover fieldset": {
                        borderColor: "lightgray",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "lightgray",
                      },
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                    "& .MuiInputBase-input": {
                      color: "white",
                    },
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={10} md={12}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel
                  htmlFor="outlined-adornment-password"
                  style={{ fontFamily: "Poppins", color: "white" }}
                >
                  Confirmar contraseña
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOff style={{ color: "white" }} />
                        ) : (
                          <Visibility style={{ color: "white" }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Confirmar contraseña"
                  inputProps={{
                    style: { fontFamily: "Poppins", color: "white" },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "white",
                      },
                      "&:hover fieldset": {
                        borderColor: "lightgray",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "lightgray",
                      },
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                    "& .MuiInputBase-input": {
                      color: "white",
                    },
                  }}
                />
              </FormControl>
            </Grid>
            <Grid container justifyContent="center" spacing={3} mt={2}>
              <Grid item xs={10} md={7}>
                <Button
                  variant="contained"
                  fullWidth
                  type="submit"
                  sx={{
                    color: "white",
                    textTransform: "none",
                    textShadow: "2px 2px 2px grey",
                    fontFamily: "Poppins",
                    margin: "1rem",
                  }}
                >
                  Registrarme
                  <span
                    style={{ margin: "1rem" }}
                    className="material-symbols-outlined"
                  >
                    how_to_reg
                  </span>
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </div>
    </Box>
  );
};

export default Register;
