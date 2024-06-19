// src/components/CheckoutSuccess.js
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./CheckOutSuccess.css";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { CartContext } from "../../../context/CartContext";

const CheckOutSuccess = () => {
  const { clearCart } = useContext(CartContext);

  const [orderId, setOrderId] = useState(null);
  const [order, setOrder] = useState(null);
  const { numberOrder } = useParams();

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
        status: "approved",
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

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Pago Exitoso</h1>
        <p className="message">
          ¡Gracias por tu compra! Tu pago ha sido procesado exitosamente.
        </p>
        <p className="order-number">Número de Orden: {numberOrder}</p>
        <button className="button" onClick={() => (window.location.href = "/")}>
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export default CheckOutSuccess;
