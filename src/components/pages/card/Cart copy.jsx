import React, { useContext } from "react";
import { CartContext } from "../../../context/CartContext";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart, deleteById, getTotalPrice, clearCart } =
    useContext(CartContext);

  let total = getTotalPrice();

  return (
    <div>
      <h1>Estoy en el carrito</h1>
      <Link to="/checkout">Finalizar Compra</Link>
      {cart.map((product) => {
        return (
          <div>
            <h6>{product.title}</h6>
            <h6>{product.quantity}</h6>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                deleteById(product.id);
              }}
            >
              Eliminar
            </Button>
          </div>
        );
      })}

      <h5>El total a pagar es: ${total}</h5>
    </div>
  );
};

export default Cart;
