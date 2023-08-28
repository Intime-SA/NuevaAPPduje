import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { forgotPassword } from "../../../firebaseConfig";

import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert(
      "LLego un mensaje a su casilla de Correo No Deseado. Sigue las instrucciones para recuperar su cuenta."
    );
    let res = await forgotPassword(email);
    console.log(res);
    return res;
  };

  return (
    <div>
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "40px",
          // backgroundColor: theme.palette.secondary.main,
        }}
      >
        <Typography variant="h5" color={"primary"}>
          ¿Olvidaste tu contraseña?
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid
            container
            rowSpacing={2}
            // alignItems="center"
            justifyContent={"center"}
          >
            <Grid item xs={10} md={12}>
              <TextField
                type="text"
                variant="outlined"
                label="Email"
                fullWidth
                name="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={10} md={12}>
              <Button type="submit" variant="contained" fullWidth>
                Recuperar
              </Button>
            </Grid>
            <Grid item xs={10} md={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                onClick={() => navigate("/login")}
              >
                Regresar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </div>
  );
};

export default ForgotPassword;
