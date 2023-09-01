import React, { useContext, useEffect, useState } from "react";
import { getDocs, collection, query, where, getDoc } from "firebase/firestore";
import { AuthContext } from "../../../context/AuthContext";
import { db } from "../../../firebaseConfig";

const UserOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const ordersCollection = collection(db, "orders");
    let ordersFiltered = query(
      ordersCollection,
      where("email", "==", user.email)
    );
    getDoc(ordersFiltered)
      .then((res) => {
        const newArr = res.docs.map((order) => {
          return { ...order.data(), id: order.id };
        });
        setMyOrders(newArr);
      })
      .catch();
  }, [user.email]);

  return (
    <div>
      <h1>Estoy en mis compras</h1>
      {myOrders.map((order) => {
        return (
          <div key={order.id}>
            <h4>El total de la orden es: {order.total}</h4>
          </div>
        );
      })}
    </div>
  );
};

export default UserOrders;
