import React, { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./CheckOutSuccess.css";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { CartContext } from "../../../context/CartContext";
import { AuthContext } from "../../../context/AuthContext";

const CheckOutSuccess = () => {
  const { clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [orderId, setOrderId] = useState(null);
  const [order, setOrder] = useState(null);
  const { numberOrder, status } = useParams();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paramsValue = queryParams.get("status");

  const [clienteRef, setClienteRef] = useState();
  const [clienteId, setClienteId] = useState();
  const [dataCliente, setDataCliente] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const userOrdersCollection = collection(db, "users");
        const snapShotOrders = await getDocs(userOrdersCollection);
        snapShotOrders.forEach(async (userArray) => {
          const userDataFromOrder = userArray.data();

          if (user && userDataFromOrder.email === user.email) {
            const clienteRef = doc(db, "users", userArray.id);
            const docSnapshot = await getDoc(clienteRef);

            if (docSnapshot.exists()) {
              setDataCliente(docSnapshot.data());

              const client = doc(db, `users/${docSnapshot.id}`);
              setClienteId(userArray.id);
              setClienteRef(client);

              console.log("Cliente ID:", userArray.id);
              console.log("Cliente Ref:", client);
            } else {
              console.log("Document does not exist");
            }
          }
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUser();
  }, [paramsValue, user]);

  useEffect(() => {
    const orderFromStorage = JSON.parse(localStorage.getItem("order"));
    if (orderFromStorage) {
      setOrder(orderFromStorage);
    } else {
      console.error("No order found in local storage");
    }
  }, []);

  useEffect(() => {
    const saveOrder = async () => {
      if (clienteRef && order) {
        try {
          const ordersCollection = collection(db, "userOrders");
          const docRef = await addDoc(ordersCollection, {
            ...order,
            date: serverTimestamp(),
            status: "pagoRecibido",
            payStatus: "approvedcuotas",
            client: clienteRef,
          });
          console.log("Document added with ID:", docRef.id);
          setOrderId(docRef.id);
          localStorage.removeItem("order");
          clearCart();
        } catch (error) {
          console.error("Error adding document:", error);
        }
      } else {
        console.log("clienteRef is undefined or order is not set");
      }
    };

    if (status === "approvedcuotas") {
      saveOrder();
    }
  }, [clienteRef, order, status]);

  useEffect(() => {
    console.log("orderId:", orderId);
  }, [orderId]);

  useEffect(() => {
    console.log("numberOrder:", numberOrder);
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
