import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { CartContext } from "../../../context/CartContext";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { Button, TextField, Typography, Box } from "@mui/material";
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
import { Link } from "react-router-dom";

function CheckOut() {
  const { cart, getTotalPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  initMercadoPago(import.meta.env.VITE_PUBLICMP, {
    locale: "es-AR",
  });
  const [preferenceId, setPreferenceId] = useState(null);
  const [userData, setUserData] = useState({});
  const [orderId, setOrderId] = useState(null);
  const [order, setOrder] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paramsValue = queryParams.get("status");

  useEffect(() => {
    let orderFromStorage = JSON.parse(localStorage.getItem("order"));
    setOrder(orderFromStorage);

    if (paramsValue === "approved") {
      let ordersCollection = collection(db, "orders");
      addDoc(ordersCollection, {
        ...orderFromStorage,
        date: serverTimestamp(),
      }).then((res) => {
        setOrderId(res.id);
      });

      orderFromStorage.items.forEach((element) => {
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
        "https://mp-pied.vercel.app/create_preference",
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
      address: userData.address,
      city: userData.city,
      province: userData.province,
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

  const [orderCompleta, setOrderCompleta] = useState(false);

  useEffect(() => {
    setOrderCompleta(true);
  }, [preferenceId]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        fontFamily: '"Poppins", sans-serif',
        padding: "2rem",
        marginTop: "5rem",
        marginLeft: "-50px",
        zoom: 0.9,
      }}
    >
      {!orderId ? (
        <div>
          <Typography
            style={{ fontFamily: '"Poppins", sans-serif', fontWeight: "900" }}
            variant="h4"
            sx={{ marginBottom: "1rem" }}
          >
            Checkout
          </Typography>
          <TextField
            onChange={handleChange}
            name="cp"
            variant="outlined"
            label="Código Postal"
            sx={{ marginBottom: "1rem", width: "100%" }}
            InputLabelProps={{
              sx: {
                fontFamily: '"Poppins", sans-serif',
                fontWeight: "400",
              },
            }}
          />
          <TextField
            onChange={handleChange}
            name="phone"
            variant="outlined"
            label="Teléfono"
            sx={{ marginBottom: "1rem", width: "100%" }}
            InputLabelProps={{
              sx: {
                fontFamily: '"Poppins", sans-serif',
                fontWeight: "400",
              },
            }}
          />
          <TextField
            onChange={handleChange}
            name="address"
            variant="outlined"
            label="Dirección"
            sx={{ marginBottom: "1rem", width: "100%" }}
            InputLabelProps={{
              sx: {
                fontFamily: '"Poppins", sans-serif',
                fontWeight: "400",
              },
            }}
          />
          <TextField
            onChange={handleChange}
            name="city"
            variant="outlined"
            label="Ciudad"
            sx={{ marginBottom: "1rem", width: "100%" }}
            InputLabelProps={{
              sx: {
                fontFamily: '"Poppins", sans-serif',
                fontWeight: "400",
              },
            }}
          />
          <TextField
            onChange={handleChange}
            name="province"
            variant="outlined"
            label="Provincia"
            sx={{ marginBottom: "1rem", width: "100%" }}
            InputLabelProps={{
              sx: {
                fontFamily: '"Poppins", sans-serif',
                fontWeight: "400",
              },
            }}
          />
          <Button
            variant="contained"
            onClick={() => handleBuy()}
            sx={{
              marginBottom: "1rem",
              width: "100%",
              fontFamily: '"Poppins", sans-serif',
            }}
          >
            Confirmar Datos
          </Button>
        </div>
      ) : (
        <div>
          <Typography
            variant="h4"
            sx={{
              marginBottom: "1rem",
              fontFamily: '"Poppins", sans-serif',
              fontWeight: "900",
            }}
          >
            Pago realizado con éxito
          </Typography>
          <Typography
            variant="body1"
            sx={{ marginBottom: "1rem", fontFamily: '"Poppins", sans-serif' }}
          >
            Orden de compra: {orderId}
          </Typography>
          <Link to="/shop">
            <Button
              style={{ fontFamily: '"Poppins", sans-serif' }}
              variant="contained"
              sx={{ width: "100%" }}
            >
              Volver a la tienda
            </Button>
          </Link>
        </div>
      )}
      {orderCompleta && preferenceId && (
        <Box
          sx={{
            marginTop: "5rem",
            width: "100%",
            padding: "5rem",
            paddingTop: "0rem",
            display: "flex",
            flexDirection: "column",
            zoom: 0.8,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              marginBottom: "1rem",
              fontFamily: '"Poppins", sans-serif',
              fontWeight: "700",
            }}
          >
            Datos del Usuario
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: '"Poppins", sans-serif',
              marginBottom: "0.5rem",
            }}
          >
            <strong style={{ fontWeight: "600" }}>Código Postal:</strong>{" "}
            {order?.cp}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: '"Poppins", sans-serif',
              marginBottom: "0.5rem",
            }}
          >
            <strong style={{ fontWeight: "600" }}>Teléfono:</strong>{" "}
            {order?.phone}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: '"Poppins", sans-serif',
              marginBottom: "0.5rem",
            }}
          >
            <strong style={{ fontWeight: "600" }}>Dirección:</strong>{" "}
            {order?.address}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: '"Poppins", sans-serif',
              marginBottom: "0.5rem",
            }}
          >
            <strong style={{ fontWeight: "600" }}>Ciudad:</strong> {order?.city}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: '"Poppins", sans-serif',
              marginBottom: "0.5rem",
            }}
          >
            <strong style={{ fontWeight: "600" }}>Provincia:</strong>{" "}
            {order?.province}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              marginTop: "2rem",
              marginBottom: "1rem",
              fontFamily: '"Poppins", sans-serif',
              fontWeight: "700",
            }}
          >
            Detalles de los Productos
          </Typography>
          {order?.items.map((item, index) => (
            <Box key={index} sx={{ marginBottom: "1rem" }}>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: '"Poppins", sans-serif',
                  marginBottom: "0.5rem",
                }}
              >
                <strong style={{ fontWeight: "600" }}>Producto:</strong>{" "}
                {item.name}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: '"Poppins", sans-serif',
                  marginBottom: "0.5rem",
                }}
              >
                <strong style={{ fontWeight: "600" }}>Cantidad:</strong>{" "}
                {item.quantity}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: '"Poppins", sans-serif',
                  marginBottom: "0.5rem",
                }}
              >
                <strong style={{ fontWeight: "600" }}>Precio Unitario:</strong>{" "}
                {item.unit_price}
              </Typography>
            </Box>
          ))}
          <Wallet initialization={{ preferenceId, redirectMode: "self" }} />
        </Box>
      )}
    </div>
  );
}

export default CheckOut;
