// src/components/CheckoutSuccess.js
import React from "react";
import { useParams } from "react-router-dom";
import "./CheckOutSuccess.css";

const CheckOutSuccess = () => {
  const { numberOrder } = useParams();

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
