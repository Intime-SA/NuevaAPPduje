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
    getDocs(ordersFiltered)
      .then((res) => {
        const newArr = res.docs.map((order) => {
          return { ...order.data(), id: order.id };
        });
        setMyOrders(newArr);
      })
      .catch();
  }, [user.email]);

  console.log(myOrders);
  return (
    <div>
      <h1>Estoy en mis compras</h1>
      {myOrders.map((order) => {
        return (
          <div key={order.id} style={{ border: "2px solid black" }}>
            {order.items?.map((product) => {
              return (
                <div key={product.id}>
                  <h2>{product.title}</h2>
                  <h2>{product.quantity}</h2>
                </div>
              );
            })}
            <h4>El total de la orden es: {order.total}</h4>
          </div>
        );
      })}
    </div>
  );
};

export default UserOrders;
