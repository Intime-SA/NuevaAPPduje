import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../../firebaseConfig";
import { getDoc, collection, doc } from "firebase/firestore";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
} from "@mui/material";
import { count } from "console";
import { useMediaQuery } from "@mui/material";
import { CartContext } from "../../../context/CartContext";
import { createTheme, useTheme } from "@mui/material/styles";
import { DrawerContext } from "../../../context/DrawerContext";

const ItemDetail = () => {
  const { id } = useParams();
  const { user, addToCart, getQuantityById } = useContext(CartContext);
  let quantity = getQuantityById(id);
  const [product, setProduct] = useState(null);
  const [counter, setCounter] = useState(quantity || 0);

  const { setOpenDrawer, openDrawer } = React.useContext(DrawerContext);
  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 800, // Define md como 800px
        lg: 1200,
        xl: 1536,
      },
    },
  });
  const isMiddleMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerWidth, setDrawerWidth] = React.useState(
    isMiddleMobile ? 75 : 240
  );

  useEffect(() => {
    let usuario = JSON.parse(localStorage.getItem("userInfo"));
    let refCollection = collection(db, "products");
    let refDoc = doc(refCollection, id);
    getDoc(refDoc)
      .then((res) => setProduct({ ...res.data(), id: res.id }))
      .catch((err) => console.log(err));
  }, [id]);

  // SUMAR

  console.log(user);

  const addOne = () => {
    if (counter < product.stock) {
      setCounter(counter + 1);
    } else {
      alert("stock completo");
    }
  };

  const subOne = () => {
    if (counter > 1) {
      setCounter(counter - 1);
    }
  };

  //RESTAR
  //AGREGAR

  const navigate = useNavigate();

  const add = () => {
    let objeto = {
      ...product,
      quantity: counter,
    };
    console.log(objeto);
    addToCart(objeto);
    navigate("/shop");
  };

  console.log(product);

  useEffect(() => {
    // Desplazarse a la parte superior de la página
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: isMobile ? "1rem" : "5rem",
      }}
    >
      {product && (
        <Card
          sx={{
            flexWrap: "nowrap",
            width: "300px", // Ajusta el ancho según tus necesidades
            margin: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <CardActionArea>
            <CardMedia
              component="img"
              height="250px"
              image={product.imageCard}
              alt="green iguana"
              sx={{ objectFit: "cover" }}
            />
            <CardContent
              sx={{
                backgroundColor: "#f7f7f7",
                padding: "0.5rem",
                borderRadius: "0 0 20px 20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: '"Poppins", sans-serif',
              }}
            >
              <Typography
                variant="body1"
                color="textSecondary"
                sx={{
                  marginBottom: "0.5rem",
                  fontFamily: '"Poppins", sans-serif',
                }}
              >
                <strong
                  style={{
                    fontFamily: '"Poppins", sans-serif',
                    fontSize: "70%",
                  }}
                >
                  Art {product.name}
                </strong>
              </Typography>
              <Typography
                gutterBottom
                variant="h6"
                component="div"
                color="red"
                sx={{
                  fontWeight: "900",
                  fontFamily: '"Poppins", sans-serif',
                }}
              >
                $
                {product.unit_price.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
              </Typography>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <p style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Precio Unitario{" "}
                </p>
                <p>
                  ${" "}
                  {product.unit_price.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  margin: "1rem",
                }}
              >
                <Typography
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: '"Poppins", sans-serif',
                  }}
                  variant="body2"
                  color="text.secondary"
                >
                  <h6 style={{ fontFamily: '"Poppins", sans-serif' }}>
                    Unidades Bulto
                  </h6>{" "}
                  <h6>{product.unidades}</h6>
                </Typography>
                <Typography
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: '"Poppins", sans-serif',
                  }}
                  variant="body2"
                  color="text.secondary"
                >
                  <h6>Precio Bulto </h6>{" "}
                </Typography>
              </div>
            </CardContent>
            <div
              style={{
                padding: "20px",
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <Button
                style={{
                  fontWeight: "900",
                  fontFamily: '"Poppins", sans-serif',
                  color: "",
                }}
                variant="contained"
                onClick={addOne}
              >
                +
              </Button>
              <Button
                style={{
                  fontWeight: "900",
                  fontFamily: '"Poppins", sans-serif',
                }}
              >
                {counter}
              </Button>
              <Button
                style={{
                  fontWeight: "900",
                  fontFamily: '"Poppins", sans-serif',
                }}
                variant="contained"
                onClick={subOne}
              >
                -
              </Button>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                style={{
                  fontWeight: "900",
                  fontFamily: '"Poppins", sans-serif',
                }}
                onClick={add}
              >
                Agregar al carrito
              </Button>
            </div>
          </CardActionArea>
        </Card>
      )}
    </div>
  );
};

export default ItemDetail;
