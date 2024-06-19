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
import { number } from "yup";

const CheckOutSuccess = () => {
  const { clearCart } = useContext(CartContext);

  const [orderId, setOrderId] = useState(null);
  const [order, setOrder] = useState(null);
  const { numberOrder, status } = useParams();
  console.log(numberOrder, status);

  const location = useLocation();
  console.log("LOCATION :", location);
  const queryParams = new URLSearchParams(location.search);
  console.log("Query :", queryParams);
  const paramsValue = queryParams.get("status");
  console.log("Params Value: ", paramsValue);

  useEffect(() => {
    let orderFromStorage = JSON.parse(localStorage.getItem("order"));
    console.log("orderFromStorage:", orderFromStorage); // Log para verificar el contenido de orderFromStorage
    setOrder(orderFromStorage);

    if (status === "approved") {
      let ordersCollection = collection(db, "orders");
      console.log("order data to be saved:", {
        ...orderFromStorage,
        date: serverTimestamp(),
        status: "approved",
      }); // Log para verificar los datos que se van a guardar

      addDoc(ordersCollection, {
        ...orderFromStorage,
        date: serverTimestamp(),
        status: "approvedGOcuotas",
      })
        .then((res) => {
          console.log("Document added with ID:", res.id); // Log para verificar el ID del documento guardado
          setOrderId(res.id);
        })
        .catch((error) => {
          console.error("Error adding document:", error); // Log de error si ocurre un problema al guardar
        });

      orderFromStorage.items.forEach((element) => {
        updateDoc(doc(db, "products", element.id), {
          stock: element.stock - element.quantity,
        })
          .then(() => {
            console.log(`Product ${element.id} stock updated`); // Log para verificar la actualización del stock
          })
          .catch((error) => {
            console.error("Error updating product stock:", error); // Log de error si ocurre un problema al actualizar el stock
          });
      });

      localStorage.removeItem("order");
      clearCart();
    }
  }, [status, numberOrder]);

  useEffect(() => {
    console.log("orderId:", orderId); // Log para verificar el orderId después de ser establecido
  }, [orderId]);

  useEffect(() => {
    console.log("numberOrder:", numberOrder); // Log para verificar el numberOrder capturado de la ruta
  }, [numberOrder]);

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Pago Exitoso</h1>
        <p className="message">
          ¡Gracias por tu compra! Tu pago ha sido procesado exitosamente.
        </p>
        <p className="order-number">Número de Orden: {numberOrder}</p>
        {orderId && <p>ID de Orden: {orderId}</p>}
        <button className="button" onClick={() => (window.location.href = "/")}>
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export default CheckOutSuccess;
