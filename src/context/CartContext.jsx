import React, { useState } from "react";
import { createContext } from "react";

export const CartContext = createContext();

const CartContextComponente = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    let existe = cart.some((e) => e.id === product.id);

    if (existe) {
      let newArr = cart.map((elemento) => {
        if (elemento.id === product.id) {
          return { ...elemento, quantity: product.quantity };
        } else {
          return elemento;
        }
      });
      setCart(newArr);
    } else {
      setCart([...cart, product]);
    }
  };

  let data = {
    cart,
    addToCart,
  };

  return <CartContext.Provider value={data}>{children}</CartContext.Provider>;
};

export default CartContextComponente;
