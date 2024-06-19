// src/components/CheckoutFailure.js
import React from "react";
import "./CheckoutFailure.css";

const CheckOutFailure = ({ onRetry }) => {
  return (
    <div className="container">
      <div className="card">
        <h1 className="title" style={{ color: "red" }}>
          Pago Fallido
        </h1>
        <p className="message">
          Hubo un problema procesando tu pago con Go Cuotas. Por favor, intenta
          nuevamente.
        </p>
        <button className="button" onClick={onRetry}>
          Reintentar
        </button>
      </div>
    </div>
  );
};

export default CheckOutFailure;
