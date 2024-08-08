import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../../../context/CartContext";
import {
  Button,
  Modal,
  Box,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useMediaQuery } from "@mui/material";
import { createTheme, useTheme } from "@mui/material/styles";
import { DrawerContext } from "../../../context/DrawerContext";

const ExpandMore = styled(({ expand, ...other }) => <IconButton {...other} />)(
  ({ theme, expand }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  })
);

const Cart = () => {
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

  const { cart, deleteById, getTotalPrice, clearCart } =
    useContext(CartContext);
  const [expanded, setExpanded] = useState(false);
  const [estado, setEstado] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [fechaHora, setFechaHora] = useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    clearCart();
    handleClose();
  };

  const handleExpandClick = () => {
    obtenerFechaHoraActual();
    setExpanded(!expanded);
  };

  const obtenerFechaHoraActual = () => {
    const fechaActual = new Date();
    const horaActual = fechaActual.toLocaleTimeString();
    const fechaActualTexto = fechaActual.toLocaleDateString();
    const fechaHoraActual = `${fechaActualTexto} ${horaActual}`;
    setFechaHora(fechaHoraActual);
  };

  const emailUser = JSON.parse(localStorage.getItem("userInfo")).email;

  let precioTotalCarrito = 0;
  for (let i = 0; i < cart.length; i++) {
    const producto = cart[i];
    const precioTotalProducto = producto.unit_price * producto.quantity;
    precioTotalCarrito += precioTotalProducto;
  }

  const precioFormateado = precioTotalCarrito.toLocaleString("es-ES", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    fontFamily: '"Poppins", sans-serif',
  };

  useEffect(() => {
    // Desplazarse a la parte superior de la página
    window.scrollTo(0, 0);
  }, []);

  function renderCartTitles(cart) {
    return cart.map((item, index) => (
      <Typography
        key={index}
        style={{ fontFamily: '"Poppins", sans-serif' }}
        variant="p"
        color="text.secondary"
      >
        {item.name}
      </Typography>
    ));
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: isMobile ? "0rem" : "6rem",
        marginLeft: isMobile ? "0rem" : "-5rem",
      }}
    >
      {cart.length > 0 ? (
        <Card sx={{ width: 345, fontFamily: '"Poppins", sans-serif' }}>
          {/*   <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                R
              </Avatar>
            }
            action={
              <IconButton
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                aria-label="settings"
              >
                <MoreVertIcon />
              </IconButton>
            }
            title={emailUser}
            subheader={fechaHora}
          /> */}
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleDelete}>
              <span className="material-symbols-outlined">delete</span>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <span className="material-symbols-outlined">picture_as_pdf</span>
            </MenuItem>
          </Menu>
          <CardMedia
            component="img"
            height="250"
            image={cart[0].imageCard}
            alt="Paella dish"
            style={{ objectFit: "cover" }}
          />
          <CardContent>
            <Typography
              style={{ fontFamily: '"Poppins", sans-serif' }}
              variant="p"
              color="text.secondary"
            >
              {cart[0].name}
            </Typography>
            <Typography
              style={{ fontFamily: '"Poppins", sans-serif' }}
              variant="body2"
              color="text.secondary"
            >
              <div>
                <h4
                  style={{
                    fontSize: "1rem",
                    fontFamily: '"Poppins", sans-serif',
                    fontWeight: 400,
                    textAlign: "right",
                  }}
                >
                  <strong>{precioFormateado}</strong>
                </h4>
              </div>
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <Button size="small" variant="contained">
              <Link to="/checkout">
                <p
                  style={{
                    color: "white",
                    fontSize: "0.75rem",
                    fontFamily: '"Poppins", sans-serif',
                  }}
                >
                  Finalizar Compra
                </p>
              </Link>
            </Button>
            <IconButton onClick={handleDelete}>
              <span className="material-symbols-outlined">delete</span>
            </IconButton>
            {/*             <IconButton aria-label="share">
              <ShareIcon />
            </IconButton> */}
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              {" "}
              <div>
                <h1
                  style={{
                    fontFamily: '"Poppins", sans-serif',
                    fontSize: "0.75rem",
                    margin: "1rem",
                  }}
                >
                  Carrito de Compras
                </h1>
                <Divider />
                <br />
                <ul>
                  {cart.map((producto, index) => (
                    <div key={index}>
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "1rem",
                            fontFamily: '"Poppins", sans-serif',
                          }}
                        >
                          {producto.name}{" "}
                        </p>
                        <strong>
                          {(producto.unit_price * producto.quantity).toFixed(2)}
                        </strong>
                      </div>

                      <p
                        style={{
                          fontSize: "1rem",
                          fontFamily: '"Poppins", sans-serif',
                        }}
                      ></p>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          fontFamily: '"Poppins", sans-serif',
                          margin: "1rem",
                        }}
                      >
                        Cantidad: {producto.quantity}
                      </p>
                    </div>
                  ))}
                </ul>
              </div>
              <Divider />
              <br />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h4
                  style={{
                    fontSize: "0.9rem",
                    fontFamily: '"Poppins", sans-serif',
                    fontWeight: 400,
                  }}
                >
                  Total Compra:
                </h4>
                <strong>{precioFormateado}</strong>
              </div>
            </CardContent>
          </Collapse>
        </Card>
      ) : (
        <h1 style={{ fontFamily: '"Poppins", sans-serif' }}>
          No hay elementos en el carrito
        </h1>
      )}
    </div>
  );
};

export default Cart;
