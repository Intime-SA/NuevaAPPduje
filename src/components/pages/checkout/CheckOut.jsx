import React, { useState } from "react";
import { useContext } from "react";
import { CartContext } from "../../../context/CartContext";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { Button } from "@mui/material";
import axios from "axios";

function CheckOut() {
  const { cart } = useContext(CartContext);
  initMercadoPago(import.meta.env.VITE_PUBLICMP, {
    locale: "es-AR",
  });

  const [preferenceId, setPreferenceId] = useState(null);

  const createPreference = async () => {
    const newArray = cart.map((product) => {
      return {
        title: product.title,
        unit_price: product.unit_price,
        quantity: product.quantity,
      };
    });
    try {
      let res = await axios.post("http://localhost:8080/create_preference", {
        items: newArray,
        shipment_cost: 10,
      });

      const { id } = res.data;
      return id;
    } catch (error) {
      console.log(error);
    }
  };

  const handleBuy = async () => {
    const id = await createPreference();
    if (id) {
      setPreferenceId(id);
    }
  };

  return (
    <div>
      <Button onClick={handleBuy}>Metodo Pago</Button>
      {preferenceId && (
        <Wallet initialization={{ preferenceId, redirectMode: "self" }} />
      )}
    </div>
  );
}

export default CheckOut;
