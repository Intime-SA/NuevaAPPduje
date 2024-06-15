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
  Tooltip,
  Typography,
  createTheme,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useContext, useState } from "react";
import { db, loginGoogle, onSingIn } from "../../../firebaseConfig";
import { collection, doc, getDoc } from "firebase/firestore";
import { AuthContext } from "../../../context/AuthContext";

const Login = () => {
  const { handleLogin } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await onSingIn(userCredentials);
      if (res.user) {
        const userCollection = collection(db, "users");
        const userRef = doc(userCollection, res.user.uid);
        const userDoc = await getDoc(userRef);
        let finalyUser = {
          email: res.user.email,
          rol: userDoc.data().rol,
        };
        handleLogin(finalyUser);
        navigate("/");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  const googleSingIn = async () => {
    let res = await loginGoogle();
    let finalyUser = {
      email: res.user.email,
      rol: "user",
    };
    handleLogin(finalyUser);
    navigate("/");
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
        <div>
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
                name="email"
                label="Email"
                fullWidth
                onChange={handleChange}
                InputProps={{
                  style: {
                    fontFamily: "Poppins",
                    color: "white",
                    backgroundColor: "#333",
                  },
                }}
                InputLabelProps={{
                  style: { fontFamily: "Poppins", color: "white" },
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
                  name="password"
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment
                      position="end"
                      style={{ backgroundColor: "#333" }}
                    >
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
                    style: {
                      fontFamily: "Poppins",
                      color: "white",
                      backgroundColor: "#333",
                    },
                  }}
                />
              </FormControl>
            </Grid>
            <Link
              to="/forgot-password"
              style={{
                color: "steelblue",
                marginTop: "10px",
                fontFamily: "Poppins",
              }}
            >
              ¿Olvidaste tu contraseña?
            </Link>
            <Grid container justifyContent="center" spacing={3} mt={2}>
              <Grid item xs={10} md={5}>
                <Button
                  variant="contained"
                  fullWidth
                  type="submit"
                  sx={{
                    color: "white",
                    textTransform: "none",
                    textShadow: "2px 2px 2px grey",
                    fontFamily: "Poppins",
                  }}
                >
                  <span class="material-symbols-outlined">passkey</span>
                </Button>
              </Grid>
              <Grid item xs={10} md={5}>
                <Tooltip title="ingresa con google">
                  <Button
                    onClick={googleSingIn}
                    variant="contained"
                    type="button"
                    fullWidth
                    sx={{
                      color: "white",
                      textTransform: "none",
                      textShadow: "2px 2px 2px grey",
                      fontFamily: "Poppins",
                    }}
                  >
                    <GoogleIcon />
                  </Button>
                </Tooltip>
              </Grid>
              <Grid item xs={10} md={8}>
                <Typography
                  color={"secondary.primary"}
                  variant={"h6"}
                  mt={1}
                  align="center"
                  style={{
                    fontFamily: "Poppins",
                    color: "white",
                    fontWeight: 100,
                  }}
                >
                  ¿Aún no tienes cuenta?
                </Typography>
              </Grid>
              <Grid item xs={10} md={5}>
                <Tooltip title="Registrate">
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate("/register")}
                    type="button"
                    sx={{
                      color: "white",
                      textTransform: "none",
                      textShadow: "2px 2px 2px grey",
                      fontFamily: "Poppins",
                    }}
                  >
                    Registrate
                  </Button>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </div>
    </Box>
  );
};

export default Login;
