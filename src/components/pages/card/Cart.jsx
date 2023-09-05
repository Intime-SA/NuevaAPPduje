import React, { useContext } from "react";
import { CartContext } from "../../../context/CartContext";
import { Button } from "@mui/material";
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

  let precioTotalCarrito = 0; // Inicializa el precio total del carrito

  for (let i = 0; i < cart.length; i++) {
    const producto = cart[i];
    const precioTotalProducto = producto.unit_price * producto.quantity;
    precioTotalCarrito += precioTotalProducto; // Suma el precio total del producto al precio total del carrito
    console.log(
      `Producto: ${producto.name}, Precio Total: ${precioTotalProducto}`
    );
  }

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

  const precioFormateado = precioTotalCarrito.toLocaleString("es-ES", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={emailUser}
        subheader={fechaHora}
      />
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
                    Precio Unitario: {producto.unit_price.toFixed(2)}
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

    // <div>
    //   <h1>Estoy en el carrito</h1>
    //   <Link to="/checkout">Finalizar Compra</Link>
    //   {cart.map((product) => {
    //     return (
    //       <div>
    //         <h6>{product.title}</h6>
    //         <h6>{product.quantity}</h6>
    //         <Button
    //           variant="outlined"
    //           size="small"
    //           onClick={() => {
    //             deleteById(product.id);
    //           }}
    //         >
    //           Eliminar
    //         </Button>
    //       </div>
    //     );
    //   })}

    //   <h5>El total a pagar es: ${total}</h5>
    // </div>
  );
};

export default Cart;
