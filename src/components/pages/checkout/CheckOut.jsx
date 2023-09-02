import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { CartContext } from "../../../context/CartContext";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import { useLocation } from "react-router";
import { db } from "../../../firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

function CheckOut() {
  const { cart, getTotalPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  initMercadoPago("APP_USR-46e7a261-c953-4d8f-a8df-76016a3ce1cd", {
    locale: "es-AR",
  });
  const [preferenceId, setPreferenceId] = useState(null);
  const [userData, setUserData] = useState();
  const [orderId, setOrderId] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paramsValue = queryParams.get("status");

  useEffect(() => {
    let order = JSON.parse(localStorage.getItem("order"));
    if (paramsValue === "approved") {
      let ordersCollection = collection(db, "orders");
      addDoc(ordersCollection, { ...order, date: serverTimestamp() }).then(
        (res) => {
          setOrderId(res.id);
        }
      );

      order.items.forEach((element) => {
        updateDoc(doc(db, "products", element.id), {
          stock: element.stock - element.quantity,
        });
      });

      localStorage.removeItem("order");
      clearCart();
    }
  }, [paramsValue]);

  let total = getTotalPrice();

  const createPreference = async () => {
    const newArray = cart.map((product) => {
      return {
        title: product.title,
        unit_price: product.unit_price,
        quantity: product.quantity,
      };
    });
    try {
      let res = await axios.post(
        "https://backend-fercho.vercel.app/create_preference",
        {
          items: newArray,
          shipment_cost: 10,
        }
      );

      const { id } = res.data;
      return id;
    } catch (error) {
      console.log(error);
    }
  };

  const handleBuy = async () => {
    let order = {
      cp: userData.cp,
      phone: userData.phone,
      items: cart,
      total: total,
      email: user.email,
    };
    localStorage.setItem("order", JSON.stringify(order));
    const id = await createPreference();
    if (id) {
      setPreferenceId(id);
    }
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {!orderId ? (
        <>
          <TextField
            onChange={handleChange}
            name="cp"
            variant="outlined"
            label="Codigo Postal"
          />
          <TextField
            onChange={handleChange}
            name="phone"
            variant="outlined"
            label="Telefono"
          />
          <Button onClick={handleBuy}>Metodo Pago</Button>
        </>
      ) : (
        <>
          <h4>Pago se realizo con exito</h4>
          <h4>orden de compra: {orderId}</h4>
          <Link to="/shop">Volver a la tienda</Link>
        </>
      )}

      {preferenceId && (
        <Wallet initialization={{ preferenceId, redirectMode: "self" }} />
      )}
    </div>
  );
}

export default CheckOut;
