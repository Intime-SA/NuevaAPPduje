import React, { useContext } from "react";
import { CartContext } from "../../../context/CartContext";
import { Button, Modal, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

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
  const { cart, deleteById, getTotalPrice, clearCart } =
    useContext(CartContext);

  let total = getTotalPrice();

  const [estado, setEstado] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    if (anchorEl && open) {
      // Si el menú está abierto, ciérralo
      setAnchorEl(null);
      setOpen(false); // Actualiza el estado a cerrado
    } else {
      // Si el menú está cerrado, ábrelo
      setAnchorEl(event.currentTarget);
      setOpen(true); // Actualiza el estado a abierto
    }
  };

  const handleClose2 = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setEstado(false);
  };

  const handleDelete = () => {
    clearCart();
  };

  const handleOpen = () => {
    setEstado(true);
  };

  const [expanded, setExpanded] = useState(false);
  const [fechaHora, setFechaHora] = useState(null);

  const obtenerFechaHoraActual = () => {
    const fechaActual = new Date();
    const horaActual = fechaActual.toLocaleTimeString();
    const fechaActualTexto = fechaActual.toLocaleDateString();

    const fechaHoraActual = `${fechaActualTexto} ${horaActual}`;
    setFechaHora(fechaHoraActual);
  };

  const handleExpandClick = () => {
    obtenerFechaHoraActual();
    setExpanded(!expanded);
  };
  const emailUser = JSON.parse(localStorage.getItem("userInfo")).email;
  console.log(emailUser);

  let precioTotalCarrito = 0; // Inicializa el precio total del carrito

  for (let i = 0; i < cart.length; i++) {
    const producto = cart[i];
    const precioTotalProducto = producto.unit_price * producto.quantity;
    precioTotalCarrito += precioTotalProducto; // Suma el precio total del producto al precio total del carrito
    console.log(
      `Producto: ${producto.name}, Precio Total: ${precioTotalProducto}`
    );
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
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {cart.length > 0 ? (
        <Card sx={{ maxWidth: 345 }}>
          <CardHeader
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
                    <span className="material-symbols-outlined">
                      picture_as_pdf
                    </span>
                  </MenuItem>
                </Menu>
              </IconButton>
            }
            title={emailUser}
            subheader={fechaHora}
          />

          <div>
            <CardMedia
              component="img"
              height="194"
              image={cart[0].img}
              alt="Paella dish"
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                ${precioFormateado}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <Button size="small" variant="contained">
                {" "}
                <Link to="/checkout">
                  <p style={{ color: "white", fontSize: "0.5rem" }}>
                    Finalizar Compra
                  </p>
                </Link>
              </Button>
              {/* <IconButton aria-label="add to favorites">
        <FavoriteIcon />
      </IconButton> */}
              <IconButton aria-label="share">
                <ShareIcon />
              </IconButton>
              <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </CardActions>
          </div>

          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography paragraph>Lista de Productos</Typography>
              <Typography paragraph></Typography>
              <div>
                <h1>Carrito de Compras</h1>
                <ul>
                  {cart.map((producto, index) => (
                    <li key={index}>
                      <p style={{ fontSize: "1rem" }}>{producto.name}</p>
                      <p style={{ fontSize: "0.5rem" }}>
                        Cantidad: {producto.quantity}
                      </p>
                      <p style={{ fontSize: "0.5rem" }}>
                        Precio Unitario: {producto.unit_price}
                      </p>
                      <p style={{ fontSize: "1rem" }}>
                        Precio Total:{" "}
                        {(producto.unit_price * producto.quantity).toFixed(2)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              <Typography paragraph>
                <div>
                  <h4 style={{ fontSize: "1.5rem" }}>
                    Total Compra: $ {precioFormateado}
                  </h4>
                </div>
              </Typography>
              <Typography></Typography>
            </CardContent>
          </Collapse>
        </Card>
      ) : (
        <h1>No hay elementos en el carrito</h1>
      )}
    </div>
  );
};

export default Cart;
